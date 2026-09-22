import { modelEvent } from './monitoring-events';

describe('model monitoring events', () => {
  it('exposes a compact rejected persona-model gate without draft content', () => {
    const event = modelEvent({ _id: 'run', task: 'narrative', model: 'nvidia/test:free', accepted: false, rejection: 'voice-quality', createdAt: new Date('2026-09-23T00:00:00.000Z') });
    expect(event).toMatchObject({ status: 'rejected', details: { accepted: false, rejection: 'voice-quality' } });
    expect(JSON.stringify(event)).not.toContain('draft');
  });
});
