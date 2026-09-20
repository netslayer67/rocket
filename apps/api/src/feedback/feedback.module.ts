import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KnowledgeModule } from '../knowledge/knowledge.module';
import { Narrative, NarrativeSchema } from '../narratives/schemas/narrative.schema';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { LearningService } from './learning.service';
import { Feedback, FeedbackSchema } from './schemas/feedback.schema';
import { LearningLog, LearningLogSchema } from './schemas/learning-log.schema';
import { AiModule } from '../ai/ai.module';
import { Knowledge, KnowledgeSchema } from '../knowledge/schemas/knowledge.schema';
import { AutonomousLearningService } from './autonomous-learning.service';
import { InternalEvidenceService } from './internal-evidence.service';
import { LearningCycle, LearningCycleSchema } from './schemas/learning-cycle.schema';

@Module({
  imports: [KnowledgeModule, AiModule, MongooseModule.forFeature([
    { name: Feedback.name, schema: FeedbackSchema }, { name: LearningLog.name, schema: LearningLogSchema }, { name: Narrative.name, schema: NarrativeSchema },
    { name: Knowledge.name, schema: KnowledgeSchema }, { name: LearningCycle.name, schema: LearningCycleSchema },
  ])],
  controllers: [FeedbackController], providers: [FeedbackService, LearningService, AutonomousLearningService, InternalEvidenceService],
  exports: [LearningService, AutonomousLearningService],
})
export class FeedbackModule {}
