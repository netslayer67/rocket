import { IsArray, IsBoolean, IsIn, IsMongoId, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateFeedbackDto {
  @IsMongoId()
  narrativeId!: string;

  @IsIn(['positive', 'negative'])
  lessonType!: 'positive' | 'negative';

  @IsObject()
  scores!: Record<string, number>;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @IsBoolean()
  approvedForLearning!: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  evidenceSources?: string[];
}
