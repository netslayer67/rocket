import { MonitoringService } from './monitoring.service';
import { jobEvent } from './monitoring-events';

function model(records: unknown[] = [], one?: unknown) {
  return {
    find: () => ({ sort: () => ({ limit: () => ({ lean: async () => records }) }) }),
    findOne: () => ({ lean: async () => one }),
  };
}

function service(data: { jobs?: unknown[]; one?: unknown; runs?: unknown[] } = {}) {
  const jobs = data.jobs ?? [];
  return new MonitoringService(
    model(jobs, data.one) as never, model(data.runs ?? []) as never, model([]) as never,
    model([]) as never, model([]) as never, model([]) as never,
    { reindex: jest.fn() } as never, { runPending: jest.fn() } as never,
    { create: jest.fn() } as never, { get: jest.fn((_: string, fallback: string) => fallback) } as never,
    { status: async () => ({ enabled: true, phase: 'waiting', reason: 'insufficient_evidence' }), recentCycles: async () => [] } as never,
  );
}

describe('MonitoringService', () => {
  it('returns an empty persisted snapshot without synthetic events', async () => {
    const result = await service().history();
    expect(result.events).toEqual([]);
    expect(result.source).toBe('persisted metadata');
    expect(result.learning?.phase).toBe('waiting');
  });

  it('emits activity first and heartbeats without changing activity state', async () => {
    const events: string[] = [];
    const subscription = service({ jobs: [{ _id: 'id', jobId: 'job', createdAt: new Date(), updatedAt: new Date(), events: [{ sequence: 1, type: 'generating', data: { progress: 40 } }] }] }).events().subscribe((event) => events.push(event.type ?? 'unknown'));
    await new Promise((resolve) => setTimeout(resolve, 20));
    subscription.unsubscribe();
    expect(events[0]).toBe('activity');
  });

  it('emits an initial scheduler snapshot even without persisted events', async () => {
    const events: string[] = [];
    const subscription = service().events().subscribe((event) => events.push(event.type ?? 'unknown'));
    await new Promise((resolve) => setTimeout(resolve, 20));
    subscription.unsubscribe();
    expect(events[0]).toBe('activity');
  });

  it('does not expose a stored job payload in a normalized event', () => {
    const result = jobEvent({ _id: 'id', jobId: 'job', payload: { topic: 'private' }, events: [{ sequence: 1, type: 'complete', data: { progress: 100 } }] } as never);
    expect(result).not.toHaveProperty('payload');
    expect(result.details).toEqual({ progress: 100 });
  });

  it('rejects retry when a job has no reusable payload', async () => {
    await expect(service({ one: { jobId: 'job' } }).retry('job')).rejects.toThrow('payload');
  });
});
