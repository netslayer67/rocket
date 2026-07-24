import { Equals, IsBoolean, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class PromoteOutcomeDto {
  @IsBoolean()
  @Equals(true)
  approved!: true;

  @IsIn(['positive', 'negative'])
  lessonType!: 'positive' | 'negative';

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
