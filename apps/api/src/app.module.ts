import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AiModule } from './ai/ai.module';
import { KnowledgeModule } from './knowledge/knowledge.module';
import { NarrativesModule } from './narratives/narratives.module';
import { PersonasModule } from './personas/personas.module';
import { ThreadsModule } from './threads/threads.module';
import { FeedbackModule } from './feedback/feedback.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['apps/api/.env', '.env'], isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const database = config.get<string>('MONGODB_DATABASE')?.trim();
        return { uri: config.get<string>('MONGODB_URI', 'mongodb://localhost:27017/rocket'), dbName: database || undefined };
      },
    }),
    AiModule,
    PersonasModule,
    KnowledgeModule,
    NarrativesModule,
    ThreadsModule,
    FeedbackModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
