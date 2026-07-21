import { IsMongoId, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class GenerateNarrativeDto {
  @IsString()
  @MaxLength(180)
  topic!: string;

  @IsMongoId()
  personaId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  referenceTitle?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  referenceUrl?: string;
}
