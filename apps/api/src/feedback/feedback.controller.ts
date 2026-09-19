import { Body, Controller, Get, Headers, Post, UnauthorizedException } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackService } from './feedback.service';

@Controller()
export class FeedbackController {
  constructor(private readonly feedback: FeedbackService) {}

  @Post('feedback')
  create(@Body() dto: CreateFeedbackDto) {
    return this.feedback.create(dto);
  }

  @Post('learning/run')
  run() {
    return this.feedback.run();
  }

  @Get('learning/cron')
  cron(@Headers('authorization') authorization?: string) {
    const secret = process.env.CRON_SECRET?.trim();
    if (!secret || authorization !== `Bearer ${secret}`) throw new UnauthorizedException('Invalid cron authorization.');
    return this.feedback.run();
  }
}
