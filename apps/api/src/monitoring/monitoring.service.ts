import { BadRequestException, Injectable, MessageEvent, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { KnowledgeService } from '../knowledge/knowledge.service';
import { NarrativeJobService } from '../narratives/narrative-job.service';
import { LearningService } from '../feedback/learning.service';
import { AutonomousLearningService } from '../feedback/autonomous-learning.service';
import { Analytics } from '../analytics/schemas/analytics.schema';
import { AiRun } from '../ai/schemas/ai-run.schema';
import { Feedback } from '../feedback/schemas/feedback.schema';
import { LearningLog } from '../feedback/schemas/learning-log.schema';
import { Knowledge } from '../knowledge/schemas/knowledge.schema';
import { NarrativeJob } from '../narratives/schemas/narrative-job.schema';
import { analyticsEvent, cycleEvent, feedbackEvent, jobEvent, knowledgeEvent, learningEvent, modelEvent, MonitoringEvent, MonitoringSnapshot } from './monitoring-events';

const DAY = 24 * 60 * 60 * 1000;

@Injectable()
export class MonitoringService {
  constructor(
    @InjectModel(NarrativeJob.name) private readonly jobs: Model<NarrativeJob>,
    @InjectModel(AiRun.name) private readonly runs: Model<AiRun>,
    @InjectModel(Feedback.name) private readonly feedback: Model<Feedback>,
    @InjectModel(LearningLog.name) private readonly logs: Model<LearningLog>,
    @InjectModel(Knowledge.name) private readonly knowledgeModel: Model<Knowledge>,
    @InjectModel(Analytics.name) private readonly analytics: Model<Analytics>,
    private readonly knowledge: KnowledgeService,
    private readonly learning: LearningService,
    private readonly narrativeJobs: NarrativeJobService,
    private readonly config: ConfigService,
    private readonly autonomous: AutonomousLearningService,
  ) {}

  async history(): Promise<MonitoringSnapshot> {
    const windowStart = new Date(Date.now() - DAY);
    const query = { createdAt: { $gte: windowStart } };
    const [jobs, runs, feedback, logs, knowledge, analytics, learning, cycles] = await Promise.all([
      this.jobs.find(query).sort({ updatedAt: -1 }).limit(100).lean(), this.runs.find(query).sort({ createdAt: -1 }).limit(100).lean(),
      this.feedback.find(query).sort({ updatedAt: -1 }).limit(100).lean(), this.logs.find(query).sort({ createdAt: -1 }).limit(100).lean(),
      this.knowledgeModel.find(query).sort({ updatedAt: -1 }).limit(100).lean(), this.analytics.find(query).sort({ createdAt: -1 }).limit(100).lean(),
      this.autonomous.status(), this.autonomous.recentCycles(windowStart),
    ]);
    const events = [...jobs.map(jobEvent), ...runs.map(modelEvent), ...feedback.map(feedbackEvent), ...logs.map(learningEvent), ...knowledge.map(knowledgeEvent), ...analytics.map(analyticsEvent), ...cycles.map(cycleEvent)]
      .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)).slice(0, 100);
    return { ...snapshot(windowStart, events), learning };
  }

  events(): Observable<MessageEvent> {
    const interval = Math.max(Number(this.config.get('MONITORING_POLL_MS', '5000')), 2000);
    const maxMs = Math.max(Number(this.config.get('MONITORING_SSE_MAX_MS', '45000')), 10000);
    return new Observable((subscriber) => {
      let previous: string | undefined;
      let inFlight = false;
      const poll = async () => {
        if (inFlight) return;
        inFlight = true;
        try {
          const current = await this.history();
          const signature = JSON.stringify([current.events, current.learning]);
          if (signature !== previous) { previous = signature; subscriber.next({ type: 'activity', data: current }); }
          else subscriber.next({ type: 'heartbeat', data: { at: new Date().toISOString(), source: 'connection' } });
        } catch { subscriber.next({ type: 'error', data: { message: 'Monitoring stream gagal membaca histori.' } }); }
        finally { inFlight = false; }
      };
      void poll();
      const timer = setInterval(() => void poll(), interval);
      const timeout = setTimeout(() => subscriber.complete(), maxMs);
      return () => { clearInterval(timer); clearTimeout(timeout); };
    });
  }

  async retry(jobId: string) {
    const job = await this.jobs.findOne({ jobId }).lean();
    if (!job) throw new NotFoundException('Job monitoring tidak ditemukan.');
    if (!job.payload) throw new BadRequestException('Job tidak memiliki payload yang dapat diulang.');
    return { jobId: await this.narrativeJobs.create(job.payload) };
  }

  reindex() { return this.knowledge.reindex(); }

  runLearning() { return this.learning.runPending(); }
}

function snapshot(windowStart: Date, events: MonitoringEvent[]): MonitoringSnapshot {
  const recent = events.filter((item) => Date.now() - Date.parse(item.occurredAt) < 60_000);
  const activeAgents = [...new Set(recent.map((item) => item.agent))];
  const activeModels = [...new Set(recent.map((item) => item.model).filter(Boolean) as string[])];
  const byKind = { job: 0, model: 0, feedback: 0, learning: 0, knowledge: 0, analytics: 0 };
  events.forEach((item) => { byKind[item.kind]++; });
  return { source: 'persisted metadata', windowStart: windowStart.toISOString(), generatedAt: new Date().toISOString(), events, summary: { total: events.length, activeAgents, activeModels, byKind } };
}
