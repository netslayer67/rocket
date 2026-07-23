import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KnowledgeModule } from '../knowledge/knowledge.module';
import { Narrative, NarrativeSchema } from '../narratives/schemas/narrative.schema';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { LearningService } from './learning.service';
import { Feedback, FeedbackSchema } from './schemas/feedback.schema';
import { LearningLog, LearningLogSchema } from './schemas/learning-log.schema';

@Module({
  imports: [KnowledgeModule, MongooseModule.forFeature([
    { name: Feedback.name, schema: FeedbackSchema }, { name: LearningLog.name, schema: LearningLogSchema }, { name: Narrative.name, schema: NarrativeSchema },
  ])],
  controllers: [FeedbackController], providers: [FeedbackService, LearningService],
})
export class FeedbackModule {}
