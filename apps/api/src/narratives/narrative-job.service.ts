import { InjectModel } from '@nestjs/mongoose';
import { Injectable, MessageEvent, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { randomUUID } from 'node:crypto';
import { Observable, ReplaySubject } from 'rxjs';
import { NarrativeJob } from './schemas/narrative-job.schema';

export type NarrativeJobStage = 'queued' | 'generating' | 'reviewing' | 'saved' | 'complete' | 'error';
export type NarrativeJobData = { stage: NarrativeJobStage; progress: number; message: string; narrative?: unknown; error?: string };
type JobInput = unknown;
type StoredEvent = { sequence: number; type: string; data: Record<string, unknown> };

@Injectable()
export class NarrativeJobService {
  private readonly jobs = new Map<string, ReplaySubject<MessageEvent>>();
  private readonly payloads = new Map<string, JobInput>();
  private readonly sequences = new Map<string, number>();
  private readonly started = new Set<string>();

  constructor(@InjectModel(NarrativeJob.name) private readonly store?: Model<NarrativeJob>) {}

  async create(input: JobInput = {}) {
    const id = randomUUID();
    const stream = new ReplaySubject<MessageEvent>(8);
    const event: MessageEvent = { type: 'queued', data: { stage: 'queued', progress: 5, message: 'Permintaan masuk ke antrean draft.' } };
    this.jobs.set(id, stream);
    this.payloads.set(id, input);
    this.sequences.set(id, 1);
    stream.next(event);
    await this.persist(id, { sequence: 0, type: 'queued', data: event.data as Record<string, unknown> }, false, input);
    return id;
  }

  events(id: string, onStart?: (input: JobInput) => Promise<void>): Observable<MessageEvent> {
    const local = this.jobs.get(id);
    if (local) {
      if (onStart) void this.startIfNeeded(id, onStart);
      return local.asObservable();
    }
    if (!this.store) throw new NotFoundException('Job narasi tidak ditemukan atau sudah kedaluwarsa.');
    const remote = new ReplaySubject<MessageEvent>(8);
    this.jobs.set(id, remote);
    void this.replay(id, remote, onStart);
    return remote.asObservable();
  }

  emit(id: string, stage: NarrativeJobStage, progress: number, message: string, extra: Partial<NarrativeJobData> = {}) {
    const stream = this.jobs.get(id);
    const event: MessageEvent = { type: stage, data: { stage, progress, message, ...extra } };
    stream?.next(event);
    const sequence = this.sequences.get(id) ?? 0;
    this.sequences.set(id, sequence + 1);
    void this.persist(id, { sequence, type: stage, data: event.data as Record<string, unknown> }, stage === 'complete' || stage === 'error');
    if (stage === 'complete' || stage === 'error') this.cleanup(id, stream);
  }

  private async startIfNeeded(id: string, onStart: (input: JobInput) => Promise<void>) {
    if (this.started.has(id)) return;
    if (!this.store) {
      const input = this.payloads.get(id);
      if (!input) return;
      this.started.add(id);
      return onStart(input);
    }
    const record = await this.store.findOneAndUpdate(
      { jobId: id, startedAt: { $exists: false } },
      { $set: { startedAt: new Date() } },
      { new: true },
    ).lean();
    if (!record) return;
    this.started.add(id);
    return onStart(record.payload ?? {});
  }

  private async persist(id: string, event: StoredEvent, complete: boolean, payload?: JobInput) {
    if (!this.store) return;
    const update: Record<string, unknown> = {
      $setOnInsert: { jobId: id, ...(payload ? { payload } : {}) },
      $push: { events: event },
      ...(complete ? { $set: { completedAt: new Date() } } : {}),
    };
    try {
      await this.store.updateOne({ jobId: id }, update as never, { upsert: true });
    } catch (error) {
      console.warn('Narrative job persistence failed', safeError(error));
    }
  }

  private async replay(id: string, stream: ReplaySubject<MessageEvent>, onStart?: (input: JobInput) => Promise<void>) {
    let attempts = 0;
    let seen = -1;
    let started = false;
    const read = async () => {
      try {
        const record = await this.store?.findOne({ jobId: id }).lean();
        if (!record && attempts++ < 80) return void setTimeout(() => void read(), 250);
        if (!record) return stream.error(new NotFoundException('Job narasi tidak ditemukan atau sudah kedaluwarsa.'));
        const liveSequence = this.sequences.get(id);
        if (liveSequence !== undefined) seen = Math.max(seen, liveSequence - 1);
        const events = [...(record.events ?? [])].sort((a, b) => a.sequence - b.sequence);
        for (const event of events) if (event.sequence > seen) { seen = event.sequence; stream.next({ type: event.type, data: event.data }); }
        this.sequences.set(id, Math.max(this.sequences.get(id) ?? 0, seen + 1));
        if (!started && onStart && !record.completedAt) {
          started = true;
          void this.startIfNeeded(id, onStart);
        }
        if (record.completedAt) return this.cleanup(id, stream);
        if (attempts++ < 240) return void setTimeout(() => void read(), 250);
        stream.error(new NotFoundException('Job narasi kedaluwarsa sebelum selesai.'));
      } catch (error) {
        stream.error(error);
      }
    };
    await read();
  }

  private cleanup(id: string, stream?: ReplaySubject<MessageEvent>) {
    if (stream) stream.complete();
    setTimeout(() => {
      if (this.jobs.get(id) === stream) this.jobs.delete(id);
      this.payloads.delete(id);
      this.sequences.delete(id);
      this.started.delete(id);
    }, 30_000);
  }
}

function safeError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return message.replace(/"user_id":"[^"]+"/g, '"user_id":"redacted"').slice(0, 300);
}
