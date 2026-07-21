import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiOrchestratorService } from './ai-orchestrator.service';
import { AiRun, AiRunSchema } from './schemas/ai-run.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: AiRun.name, schema: AiRunSchema }])],
  providers: [AiOrchestratorService],
  exports: [AiOrchestratorService],
})
export class AiModule {}
