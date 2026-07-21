import { IsArray, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePersonaDto {
  @IsString()
  @MaxLength(60)
  name!: string;

  @IsString()
  @MaxLength(160)
  tone!: string;

  @IsArray()
  @IsString({ each: true })
  vocabulary!: string[];

  @IsIn(['short', 'medium', 'long'])
  sentenceLength!: 'short' | 'medium' | 'long';

  @IsOptional()
  @IsString()
  @MaxLength(60)
  emojiHabit?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  interactionStyle?: string;
}
