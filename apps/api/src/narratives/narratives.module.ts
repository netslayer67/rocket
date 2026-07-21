import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { KnowledgeModule } from '../knowledge/knowledge.module';
import { PersonasModule } from '../personas/personas.module';
import { MongooseModule } from '@nestjs/mongoose';
import { NarrativesController } from './narratives.controller';
import { NarrativesService } from './narratives.service';
import { Narrative, NarrativeSchema } from './schemas/narrative.schema';

@Module({
  imports: [
    AiModule,
    KnowledgeModule,
    PersonasModule,
    MongooseModule.forFeature([{ name: Narrative.name, schema: NarrativeSchema }]),
  ],
  controllers: [NarrativesController],
  providers: [NarrativesService],
})
export class NarrativesModule {}
