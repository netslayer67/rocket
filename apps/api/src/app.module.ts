import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AiModule } from './ai/ai.module';
import { KnowledgeModule } from './knowledge/knowledge.module';
import { NarrativesModule } from './narratives/narratives.module';
import { PersonasModule } from './personas/personas.module';
import { ThreadsModule } from './threads/threads.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
  ],
})
export class AppModule {}
