import { Type } from 'class-transformer';
import { ArrayMaxSize, IsOptional, IsString, IsUrl, MaxLength, ValidateNested } from 'class-validator';

export class NarrativeReferenceDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string;

  @IsUrl({ require_tld: false })
  url!: string;
}

export class GenerateNarrativeDto {
  @IsString()
  @MaxLength(180)
  topic!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  referenceTitle?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  referenceUrl?: string;

  @IsOptional()
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  @Type(() => NarrativeReferenceDto)
  references?: NarrativeReferenceDto[];
}
