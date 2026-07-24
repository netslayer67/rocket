import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CaptureAnalyticsDto } from './dto/capture-analytics.dto';
import { PromoteOutcomeDto } from './dto/promote-outcome.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Post()
  capture(@Body() dto: CaptureAnalyticsDto) {
    return this.analytics.capture(dto);
  }

  @Get('summary')
  summary() {
    return this.analytics.summary();
  }

  @Get('insights')
  insights() {
    return this.analytics.insights();
  }

  @Post('insights/:narrativeId/promote')
  promote(@Param('narrativeId') narrativeId: string, @Body() dto: PromoteOutcomeDto) {
    return this.analytics.promote(narrativeId, dto);
  }
}
