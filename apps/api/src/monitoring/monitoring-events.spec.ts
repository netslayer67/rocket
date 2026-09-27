import { jobEvents, modelEvent } from './monitoring-events';

describe('model monitoring events', () => {
  it('exposes a compact rejected persona-model gate without draft content', () => {
    const event = modelEvent({ _id: 'run', task: 'narrative', model: 'nvidia/test:free', accepted: false, rejection: 'http-404', retrieval: { mode: 'recent-fallback', semanticCount: 0, lexicalCount: 0, semanticQueried: true }, createdAt: new Date('2026-09-23T00:00:00.000Z') });
    expect(event).toMatchObject({ status: 'rejected', details: { accepted: false, rejection: 'http-404', semanticQueried: true } });
    expect(JSON.stringify(event)).not.toContain('draft');
  });
});

describe('job monitoring events', () => {
  it('keeps each persisted owned stage instead of collapsing a job to its latest event', () => {
    const events = jobEvents({ _id: 'job', jobId: 'job', createdAt: new Date(), events: [
      { sequence: 1, type: 'generating', data: { progress: 20, agent: 'Reference Agent' } },
      { sequence: 2, type: 'generating', data: { progress: 38, agent: 'Knowledge Agent' } },
    ] });

    expect(events.map((event) => event.agent)).toEqual(['Reference Agent', 'Knowledge Agent']);
    expect(JSON.stringify(events)).not.toContain('payload');
  });
});
