import { Injectable, OnModuleDestroy, OnModuleInit, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AiOrchestratorService } from '../ai/ai-orchestrator.service';
import { KnowledgeService } from '../knowledge/knowledge.service';
import { evidenceFingerprint, InternalEvidenceService } from './internal-evidence.service';
import { acceptsInternalLesson, learningSystem, parseInternalLesson, reviewSystem } from './internal-lesson';
import { LearningCycle } from './schemas/learning-cycle.schema';

const activePhases = ['synthesizing', 'validating', 'saving'];
const dailyLimit = 4;
const retryDelay = 15 * 60_000;

@Injectable()
export class AutonomousLearningService implements OnModuleInit, OnModuleDestroy {
  private timer?: ReturnType<typeof setTimeout>;
  private running = false;
  private stopped = false;
  private phase = 'starting';
  private reason = 'awaiting_check';
  private lastCheck?: string;
  private nextCheck?: string;
  private sourceCount = 0;

  constructor(
    private readonly config: ConfigService,
    @InjectModel(LearningCycle.name) private readonly cycles: Model<LearningCycle>,
    private readonly evidence: InternalEvidenceService,
    private readonly ai: AiOrchestratorService,
    private readonly knowledge: KnowledgeService,
  ) {}

  get enabled() {
    const setting = this.config.get<string>('AUTONOMOUS_LEARNING_ENABLED');
    return setting === undefined ? Boolean(this.config.get('RAILWAY_ENVIRONMENT_ID')) && !this.config.get('VERCEL') : setting === 'true';
  }

  onModuleInit() {
    if (this.enabled) void this.schedule();
  }

  onModuleDestroy() {
    this.stopped = true;
    if (this.timer) clearTimeout(this.timer);
  }

  private async schedule() {
    await this.check();
    if (this.stopped) return;
    const configured = Number(this.config.get('AUTONOMOUS_LEARNING_INTERVAL_MS', '300000'));
    const interval = Number.isFinite(configured) ? Math.max(60_000, configured) : 300_000;
    this.nextCheck = new Date(Date.now() + interval).toISOString();
    this.timer = setTimeout(() => void this.schedule(), interval);
    this.timer.unref();
  }

  async status() {
    const [latest, attemptsToday] = await Promise.all([
      this.cycles.findOne().sort({ createdAt: -1 }).lean(),
      this.cycles.countDocuments({ day: new Date().toISOString().slice(0, 10) }),
    ]);
    return { enabled: this.enabled, phase: this.enabled ? this.phase : 'disabled', reason: this.reason,
      lastCheck: this.lastCheck, nextCheck: this.nextCheck, sourceCount: this.sourceCount,
      attemptsToday, dailyLimit, freeOnly: true, latest };
  }

  recentCycles(since: Date) {
    return this.cycles.find({ createdAt: { $gte: since } }).sort({ createdAt: -1 }).limit(100).lean();
  }

  async check() {
    if (!this.enabled || this.running || this.stopped) return;
    // ponytail: one persistent replica; add a distributed lease/quota before increasing worker replicas.
    this.running = true;
    this.lastCheck = new Date().toISOString();
    this.nextCheck = undefined;
    this.state('checking', 'checking_sources');
    try {
      await this.cycles.updateMany({ phase: { $in: activePhases }, updatedAt: { $lt: new Date(Date.now() - retryDelay) } },
        { $set: { phase: 'failed', reason: 'interrupted', finishedAt: new Date() } });
      const evidence = await this.evidence.collect();
      this.sourceCount = evidence.length;
      if (evidence.length < 2) return this.state('waiting', 'insufficient_evidence');
      const fingerprint = evidenceFingerprint(evidence);
      const previous = await this.cycles.findOne({ fingerprint }).sort({ createdAt: -1 }).lean();
      if (previous && ['complete', 'rejected'].includes(previous.phase)) return this.state('waiting', 'unchanged_evidence');
      if (previous) {
        const saved = await this.knowledge.findAutonomousLesson(fingerprint);
        if (saved) {
          const reason = saved.vectorStatus === 'ready' ? 'lesson_saved' : 'lesson_saved_index_pending';
          await this.cycles.updateOne({ _id: previous._id }, { $set: { phase: 'complete', reason, knowledgeId: String(saved._id), finishedAt: new Date() } });
          return this.state('complete', reason);
        }
        if (previous.phase !== 'failed') return this.state('backoff', 'retry_later');
      }
      const day = new Date().toISOString().slice(0, 10);
      const attempts = await this.cycles.countDocuments({ fingerprint, day });
      if (attempts >= 2) return this.state('backoff', 'batch_daily_limit');
      if (previous && Date.now() - new Date(previous.updatedAt).getTime() < retryDelay) return this.state('backoff', 'retry_later');
      if (await this.cycles.countDocuments({ day }) >= dailyLimit) return this.state('quota', 'daily_limit');
      const cycle = await this.cycles.create({ fingerprint, attempt: attempts + 1, day,
        evidenceIds: evidence.map((item) => item.id), phase: 'synthesizing' });
      try {
        this.state('synthesizing', 'processing_evidence');
        const existing = await this.evidence.recentLessons();
        const result = await this.ai.complete({ task: 'internal-learning', system: learningSystem,
          prompt: JSON.stringify({ evidence, existing }), maxTokens: 3200, json: true, freeOnly: true });
        if (result.mode !== 'live') throw new ServiceUnavailableException();
        cycle.models = [result.model];
        const candidate = parseInternalLesson(result.content, evidence);
        if (!candidate || existing.some((item) => item.patternSummary.trim().toLowerCase() === candidate.pattern.patternSummary.trim().toLowerCase())) {
          return await this.finish(cycle, 'rejected', 'no_valid_novel_lesson');
        }
        cycle.phase = 'validating';
        await cycle.save();
        this.state('validating', 'checking_candidate');
        const review = await this.ai.complete({ task: 'internal-learning-review', system: reviewSystem,
          prompt: JSON.stringify({ evidence, existing, candidate }), maxTokens: 1200, json: true, freeOnly: true });
        if (review.mode !== 'live') throw new ServiceUnavailableException();
        cycle.models.push(review.model);
        if (!acceptsInternalLesson(review.content)) return await this.finish(cycle, 'rejected', 'review_rejected');
        if (this.stopped || evidenceFingerprint(await this.evidence.collect()) !== fingerprint) {
          return await this.finish(cycle, 'rejected', 'sources_changed');
        }
        cycle.phase = 'saving';
        await cycle.save();
        this.state('saving', 'saving_knowledge');
        const record = await this.knowledge.createAutonomousLesson(candidate.pattern, fingerprint, candidate.evidenceIds);
        cycle.knowledgeId = String(record._id);
        await this.finish(cycle, 'complete', record.vectorStatus === 'ready' ? 'lesson_saved' : 'lesson_saved_index_pending');
      } catch (error) {
        const malformed = error instanceof SyntaxError;
        await this.finish(cycle, 'failed', malformed ? 'invalid_model_output'
          : error instanceof ServiceUnavailableException ? 'free_model_unavailable' : 'storage_or_index_unavailable');
      }
    } catch {
      this.state('error', 'storage_unavailable');
    } finally {
      this.running = false;
    }
  }

  private async finish(cycle: LearningCycle & { save(): Promise<unknown> }, phase: string, reason: string) {
    cycle.phase = phase;
    cycle.reason = reason;
    cycle.finishedAt = new Date();
    await cycle.save();
    this.state(phase === 'failed' ? 'unavailable' : phase, reason);
  }

  private state(phase: string, reason: string) {
    this.phase = phase;
    this.reason = reason;
  }
}
