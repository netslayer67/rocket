import { Injectable } from '@nestjs/common';
import { GenerateNarrativeDto } from './dto/generate-narrative.dto';
import { NarrativeJobService } from './narrative-job.service';
import { NarrativesService } from './narratives.service';

@Injectable()
export class NarrativeJobRunner {
  constructor(private readonly narratives: NarrativesService, private readonly jobs: NarrativeJobService) {}

  async run(id: string, dto: GenerateNarrativeDto) {
    try {
      const narrative = await this.narratives.generate(dto, (stage, progress, message) => this.jobs.emit(id, stage, progress, message));
      this.jobs.emit(id, 'complete', 100, 'Draft tersimpan dan siap direview.', { narrative });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Draft tidak dapat dibuat.';
      this.jobs.emit(id, 'error', 100, 'Pembuatan draft gagal.', { error: message });
    }
  }
}
