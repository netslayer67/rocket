import { Equals, IsBoolean } from 'class-validator';

export class ConfirmMonitoringActionDto {
  @IsBoolean()
  @Equals(true)
  confirmed!: true;
}
