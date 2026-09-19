import { Body, Controller, Get, Post, Sse } from '@nestjs/common';
import { ConfirmMonitoringActionDto } from './dto/confirm-monitoring-action.dto';
import { RetryMonitoringJobDto } from './dto/retry-monitoring-job.dto';
import { MonitoringService } from './monitoring.service';

@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoring: MonitoringService) {}

  @Get('history') history() { return this.monitoring.history(); }

  @Sse('events') events() { return this.monitoring.events(); }

  @Post('actions/retry') retry(@Body() dto: RetryMonitoringJobDto) { return this.monitoring.retry(dto.jobId); }

  @Post('actions/reindex') reindex(@Body() dto: ConfirmMonitoringActionDto) { void dto; return this.monitoring.reindex(); }

  @Post('actions/learning') learning(@Body() dto: ConfirmMonitoringActionDto) { void dto; return this.monitoring.runLearning(); }
}
