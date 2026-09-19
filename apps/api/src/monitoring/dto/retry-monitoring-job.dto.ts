import { Equals, IsBoolean, IsUUID } from 'class-validator';

export class RetryMonitoringJobDto {
  @IsUUID()
  jobId!: string;

  @IsBoolean()
  @Equals(true)
  confirmed!: true;
}
