import { IsUrl } from 'class-validator';

export class SuggestNarrativeDto {
  @IsUrl({ require_tld: false })
  referenceUrl!: string;
}
