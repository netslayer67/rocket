import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query, Sse } from '@nestjs/common';
import { GenerateNarrativeDto } from './dto/generate-narrative.dto';
import { SuggestNarrativeDto } from './dto/suggest-narrative.dto';
import { NarrativesService } from './narratives.service';
import { NarrativeJobRunner } from './narrative-job.runner';
import { NarrativeJobService } from './narrative-job.service';

@Controller('narratives')
export class NarrativesController {
  constructor(private readonly narratives: NarrativesService, private readonly jobs: NarrativeJobService, private readonly runner: NarrativeJobRunner) {}

  @Get()
  findAll() {
    return this.narratives.findAll();
  }

  @Post('generate')
  async generate(@Body() dto: GenerateNarrativeDto) {
    return { jobId: await this.jobs.create(dto) };
  }

  @Sse('events')
  events(@Query('jobId', ParseUUIDPipe) jobId: string) {
    return this.jobs.events(jobId, (input) => this.runner.run(jobId, input as unknown as GenerateNarrativeDto));
  }

  @Post('suggestions')
  suggest(@Body() dto: SuggestNarrativeDto) {
    return this.narratives.suggest(dto);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.narratives.approve(id);
  }

  @Post(':id/publish')
  publish(@Param('id') id: string) {
    return this.narratives.publish(id);
  }
}
