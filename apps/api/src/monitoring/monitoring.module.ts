import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Analytics, AnalyticsSchema } from '../analytics/schemas/analytics.schema';
import { AiRun, AiRunSchema } from '../ai/schemas/ai-run.schema';
import { Feedback, FeedbackSchema } from '../feedback/schemas/feedback.schema';
import { FeedbackModule } from '../feedback/feedback.module';
import { LearningLog, LearningLogSchema } from '../feedback/schemas/learning-log.schema';
import { Knowledge, KnowledgeSchema } from '../knowledge/schemas/knowledge.schema';
import { KnowledgeModule } from '../knowledge/knowledge.module';
import { NarrativeJob, NarrativeJobSchema } from '../narratives/schemas/narrative-job.schema';
import { NarrativesModule } from '../narratives/narratives.module';
import { MonitoringController } from './monitoring.controller';
import { MonitoringService } from './monitoring.service';

@Module({
  imports: [FeedbackModule, KnowledgeModule, NarrativesModule, MongooseModule.forFeature([
    { name: NarrativeJob.name, schema: NarrativeJobSchema }, { name: AiRun.name, schema: AiRunSchema },
    { name: Feedback.name, schema: FeedbackSchema }, { name: LearningLog.name, schema: LearningLogSchema },
    { name: Knowledge.name, schema: KnowledgeSchema }, { name: Analytics.name, schema: AnalyticsSchema },
  ])],
  controllers: [MonitoringController], providers: [MonitoringService],
})
export class MonitoringModule {}
