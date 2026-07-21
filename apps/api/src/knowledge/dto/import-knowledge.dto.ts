import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ImportKnowledgeDto {
  @IsString()
  @MaxLength(80)
  sourceLabel!: string;

  @IsString()
  @MaxLength(20000)
  content!: string;

  @IsOptional()
  @IsString()
  @MaxLength(400)
  sourceUrl?: string;
}
