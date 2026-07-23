import { Body, Controller, Get, Post } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CaptureAnalyticsDto } from './dto/capture-analytics.dto';

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
}
