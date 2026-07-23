import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Narrative, NarrativeSchema } from '../narratives/schemas/narrative.schema';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Analytics, AnalyticsSchema } from './schemas/analytics.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Analytics.name, schema: AnalyticsSchema }, { name: Narrative.name, schema: NarrativeSchema }])],
  controllers: [AnalyticsController], providers: [AnalyticsService],
})
export class AnalyticsModule {}
