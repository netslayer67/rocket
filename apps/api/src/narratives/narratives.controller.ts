import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { GenerateNarrativeDto } from './dto/generate-narrative.dto';
import { SuggestNarrativeDto } from './dto/suggest-narrative.dto';
import { NarrativesService } from './narratives.service';

@Controller('narratives')
export class NarrativesController {
  constructor(private readonly narratives: NarrativesService) {}

  @Get()
  findAll() {
    return this.narratives.findAll();
  }

  @Post('generate')
  generate(@Body() dto: GenerateNarrativeDto) {
    return this.narratives.generate(dto);
  }

  @Post('suggestions')
  suggest(@Body() dto: SuggestNarrativeDto) {
    return this.narratives.suggest(dto);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.narratives.approve(id);
  }
}
