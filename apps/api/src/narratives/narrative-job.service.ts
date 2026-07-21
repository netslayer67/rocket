import { Injectable, MessageEvent, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Observable, ReplaySubject } from 'rxjs';

export type NarrativeJobStage = 'queued' | 'generating' | 'reviewing' | 'saved' | 'complete' | 'error';
export type NarrativeJobData = { stage: NarrativeJobStage; progress: number; message: string; narrative?: unknown; error?: string };

@Injectable()
export class NarrativeJobService {
  // ponytail: in-process registry; use BullMQ/Redis when multi-instance durability matters.
  private readonly jobs = new Map<string, ReplaySubject<MessageEvent>>();

  create() {
    const id = randomUUID();
    const stream = new ReplaySubject<MessageEvent>(8);
    this.jobs.set(id, stream);
    this.emit(id, 'queued', 5, 'Permintaan masuk ke antrean draft.');
    return id;
  }

  events(id: string): Observable<MessageEvent> {
    const stream = this.jobs.get(id);
    if (!stream) throw new NotFoundException('Job narasi tidak ditemukan atau sudah kedaluwarsa.');
    return stream.asObservable();
  }

  emit(id: string, stage: NarrativeJobStage, progress: number, message: string, extra: Partial<NarrativeJobData> = {}) {
    const stream = this.jobs.get(id);
    if (!stream) return;
    stream.next({ type: stage, data: { stage, progress, message, ...extra } });
    if (stage === 'complete' || stage === 'error') this.cleanup(id, stream);
  }

  private cleanup(id: string, stream: ReplaySubject<MessageEvent>) {
    stream.complete();
    setTimeout(() => {
      if (this.jobs.get(id) === stream) this.jobs.delete(id);
    }, 30_000);
  }
}
