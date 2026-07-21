import { NarrativeJobService } from './narrative-job.service';

describe('NarrativeJobService', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('replays lifecycle events and closes after completion', () => {
    const service = new NarrativeJobService();
    const id = service.create();
    const events: string[] = [];
    service.events(id).subscribe({ next: (event) => events.push(event.type ?? ''), complete: () => events.push('closed') });

    service.emit(id, 'generating', 20, 'Menyusun.');
    service.emit(id, 'complete', 100, 'Selesai.', { narrative: { _id: 'n1' } });

    expect(events).toEqual(['queued', 'generating', 'complete', 'closed']);
    jest.runAllTimers();
    expect(() => service.events(id)).toThrow('Job narasi tidak ditemukan');
  });

  it('rejects unknown jobs', () => {
    const service = new NarrativeJobService();
    expect(() => service.events('missing')).toThrow('Job narasi tidak ditemukan');
  });
});
