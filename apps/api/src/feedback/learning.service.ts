import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { KnowledgeService } from '../knowledge/knowledge.service';
import { Feedback } from './schemas/feedback.schema';
import { LearningLog } from './schemas/learning-log.schema';
import { Narrative } from '../narratives/schemas/narrative.schema';

@Injectable()
export class LearningService implements OnModuleInit, OnModuleDestroy {
  private timer?: NodeJS.Timeout;

  constructor(
    @InjectModel(Feedback.name) private readonly feedback: Model<Feedback>,
    @InjectModel(LearningLog.name) private readonly logs: Model<LearningLog>,
    @InjectModel(Narrative.name) private readonly narratives: Model<Narrative>,
    private readonly knowledge: KnowledgeService,
    private readonly config: ConfigService,
  ) {}

  onModuleInit() {
    if (this.config.get<string>('LEARNING_SCHEDULER_ENABLED') !== 'true') return;
    const interval = Number(this.config.get<string>('LEARNING_INTERVAL_MS', '86400000'));
    this.timer = setInterval(() => void this.runPending(), Math.max(interval, 60000));
    this.timer.unref();
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  async runPending() {
    const pending = await this.feedback.find({ approvedForLearning: true, learnedAt: { $exists: false } }).limit(20).lean();
    const result = { processed: 0, skipped: 0, failed: 0 };
    for (const item of pending) {
      const state = await this.learnOne(String(item._id));
      result[state]++;
    }
    return result;
  }

  async learnOne(id: string) {
    const item = await this.feedback.findById(id).lean();
    if (!item || !item.approvedForLearning) return 'skipped' as const;
    if (await this.logs.exists({ feedbackId: item._id })) return 'skipped' as const;
    const narrative = await this.narratives.findById(item.narrativeId).lean();
    if (!narrative) return 'failed' as const;
    try {
      const weakest = weakestDimension(item.scores);
      const lesson = await this.knowledge.createLesson({
        sourceLabel: `Feedback lesson ${String(item._id)}: ${narrative.topic}`.slice(0, 180),
        topics: [narrative.topic.slice(0, 120)], hookType: weakest.dimension, emotion: item.lessonType === 'positive' ? 'confidence' : 'caution',
        narrativeType: 'review diagnosis', curiosityLevel: item.lessonType === 'positive' ? 4 : 2, linkPlacement: narrative.linkPlacement,
        patternSummary: item.notes?.slice(0, 700) || `Review ${item.lessonType} untuk ${narrative.title}`,
        conflict: weakest.dimension, persona: 'reviewer feedback', style: 'diagnosis-first', vocabulary: [],
        informationGap: '', discussionPattern: 'review dimensions', authorityType: 'human reviewer', ctaStyle: 'reference',
        naturalness: Math.max(1, Math.min(5, Math.round((item.scores.naturalness ?? 5) / 2))), lessonType: item.lessonType,
        diagnosis: item.notes?.slice(0, 700) || `Dimensi terlemah: ${weakest.dimension} (${weakest.score}/10)`,
        rootCause: `Review score terendah ada pada ${weakest.dimension}.`, recommendedFix: fixFor(weakest.dimension),
        failureDimensions: item.lessonType === 'negative' ? [weakest.dimension] : [], evidenceSources: ['reviewer-feedback'],
      });
      await this.feedback.updateOne({ _id: item._id }, { learnedAt: new Date(), knowledgeId: lesson._id });
      await this.logs.create({ feedbackId: item._id, knowledgeId: lesson._id, status: 'complete' });
      return 'processed' as const;
    } catch (error) {
      await this.logs.create({ feedbackId: item._id, status: 'failed', error: String(error).slice(0, 300) });
      return 'failed' as const;
    }
  }
}

function weakestDimension(scores: Record<string, number> = {}) {
  const entries = Object.entries(scores).map(([dimension, value]) => ({ dimension, score: clamp(value) }));
  return entries.sort((a, b) => a.score - b.score)[0] ?? { dimension: 'narrative', score: 5 };
}

function clamp(value: unknown) {
  return Math.max(0, Math.min(10, Number(value) || 0));
}

function fixFor(dimension: string) {
  const fixes: Record<string, string> = { hook: 'Mulai dengan observasi yang spesifik dan terasa diucapkan.', persona: 'Gunakan cara berpikir persona, bukan kuota kosakata.', evidence: 'Tandai sumber bukti atau ubah klaim menjadi dugaan.', scene: 'Pertahankan aktivitas, objek, dan tempat dalam satu adegan.', link: 'Hadirkan referensi setelah pembaca punya alasan untuk peduli.' };
  return fixes[dimension] ?? 'Perbaiki dimensi terlemah tanpa memaksa satu template.';
}
