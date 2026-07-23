import { Body, Controller, Post } from '@nestjs/common';
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
}
