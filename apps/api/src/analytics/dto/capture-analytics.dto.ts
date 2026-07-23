import { IsInt, IsMongoId, IsOptional, IsString, Min } from 'class-validator';

export class CaptureAnalyticsDto {
  @IsMongoId()
  narrativeId!: string;

  @IsOptional()
  @IsString()
  publishedThreadId?: string;

  @IsOptional() @IsInt() @Min(0) views?: number;
  @IsOptional() @IsInt() @Min(0) clicks?: number;
  @IsOptional() @IsInt() @Min(0) likes?: number;
  @IsOptional() @IsInt() @Min(0) replies?: number;
  @IsOptional() @IsInt() @Min(0) reposts?: number;
  @IsOptional() @IsInt() @Min(0) quotes?: number;
}
