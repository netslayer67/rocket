import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { MongooseModule } from '@nestjs/mongoose';
import { KnowledgeController } from './knowledge.controller';
import { KnowledgeService } from './knowledge.service';
import { Knowledge, KnowledgeSchema } from './schemas/knowledge.schema';
import { VectorIndexService } from './vector-index.service';

@Module({
  imports: [AiModule, MongooseModule.forFeature([{ name: Knowledge.name, schema: KnowledgeSchema }])],
  controllers: [KnowledgeController],
  providers: [KnowledgeService, VectorIndexService],
  exports: [KnowledgeService],
})
export class KnowledgeModule {}
