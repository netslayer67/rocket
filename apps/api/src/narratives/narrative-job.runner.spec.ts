import { NarrativeJobRunner } from './narrative-job.runner';
import { NarrativeJobService } from './narrative-job.service';

describe('NarrativeJobRunner', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('emits saved before complete', async () => {
    const jobs = new NarrativeJobService();
    const id = await jobs.create();
    const stages: string[] = [];
    jobs.events(id).subscribe({ next: (event) => stages.push(event.type ?? ''), complete: () => stages.push('closed') });
    const narratives = { generate: jest.fn(async (_dto, progress) => { progress('generating', 20, 'Menyusun.'); progress('saved', 90, 'Tersimpan.'); return { _id: 'n1' }; }) };
    const runner = new NarrativeJobRunner(narratives as never, jobs);

    await runner.run(id, { topic: 'tes', personaId: '507f1f77bcf86cd799439011' });

    expect(stages).toEqual(['queued', 'generating', 'saved', 'complete', 'closed']);
    jest.runAllTimers();
  });

  it('emits a safe error event when generation fails', async () => {
    const jobs = new NarrativeJobService();
    const id = await jobs.create();
    const events: string[] = [];
    jobs.events(id).subscribe({ next: (event) => events.push(event.type ?? ''), complete: () => events.push('closed') });
    const narratives = { generate: jest.fn().mockRejectedValue(new Error('provider down')) };
    const runner = new NarrativeJobRunner(narratives as never, jobs);

    await runner.run(id, { topic: 'tes', personaId: '507f1f77bcf86cd799439011' });

    expect(events).toEqual(['queued', 'error', 'closed']);
    jest.runAllTimers();
  });
});
