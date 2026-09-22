import { ServiceUnavailableException } from '@nestjs/common';
import { AutonomousLearningService } from './autonomous-learning.service';

const inputs = [
  { id: 'feedback:1', kind: 'feedback' as const, data: { notes: 'No contextual bridge.' } },
  { id: 'dna:2', kind: 'dna' as const, data: { patternSummary: 'Explain reference relevance.' } },
];
const candidate = {
  lessonType: 'negative', topics: ['reference'], patternSummary: 'Reference relevance needs a contextual bridge.',
  diagnosis: 'The unexplained reference distracts from the observed question.', rootCause: 'Missing bridge from question to reference.',
  recommendedFix: 'Where relevant, connect the reference to an observed question.', failureDimensions: ['reference'],
  evidenceIds: ['feedback:1', 'dna:2'], hookType: 'observation', emotion: 'curiosity', narrativeType: 'discussion',
  curiosityLevel: 3, naturalness: 4, linkPlacement: 'ending',
};

function setup(settings: Record<string, string> = { AUTONOMOUS_LEARNING_ENABLED: 'true' }) {
  const rows: any[] = [];
  const cycles = {
    updateMany: jest.fn().mockResolvedValue({}),
    findOne: (query?: { fingerprint: string }) => ({ sort: () => ({ lean: async () => [...rows].reverse().find((row) => !query || row.fingerprint === query.fingerprint) }) }),
    countDocuments: jest.fn(async (query: { day: string; fingerprint?: string }) => rows.filter((row) => row.day === query.day && (!query.fingerprint || row.fingerprint === query.fingerprint)).length),
    updateOne: jest.fn().mockResolvedValue({}),
    create: jest.fn(async (input) => {
      const row = { ...input, _id: String(rows.length), createdAt: new Date(), updatedAt: new Date(), models: [], save: jest.fn(async () => { row.updatedAt = new Date(); }) };
      rows.push(row); return row;
    }),
  };
  const evidence = { collect: jest.fn().mockResolvedValue(inputs), recentLessons: jest.fn().mockResolvedValue([]) };
  const ai = { complete: jest.fn(async (request) => ({ mode: 'live', model: 'model:free', content: JSON.stringify(
    request.task === 'internal-learning' ? candidate : { grounded: true, novel: true, nonContradictory: true, contextual: true },
  ) })) };
  const knowledge = { createAutonomousLesson: jest.fn().mockResolvedValue({ _id: 'knowledge', vectorStatus: 'ready' }), findAutonomousLesson: jest.fn().mockResolvedValue(null) };
  const config = { get: (key: string, fallback?: string) => settings[key] ?? fallback };
  const personas = { findActive: jest.fn().mockResolvedValue({ _id: 'active' }) };
  const restart = () => new AutonomousLearningService(config as never, cycles as never, evidence as never, ai as never, knowledge as never, personas as never);
  return { service: restart(), restart, cycles, rows, evidence, ai, knowledge };
}

describe('Autonomous internal worker', () => {
  it('synthesizes, checks, saves once and skips unchanged evidence across a restart', async () => {
    const { service, restart, rows, knowledge, ai } = setup();
    await service.check();
    await restart().check();
    expect(rows[0]).toMatchObject({ phase: 'complete', knowledgeId: 'knowledge', attempt: 1 });
    expect(knowledge.createAutonomousLesson).toHaveBeenCalledTimes(1);
    expect(ai.complete).toHaveBeenCalledTimes(2);
    expect(ai.complete.mock.calls.every(([request]) => request.freeOnly)).toBe(true);
    await service.check();
    expect(ai.complete).toHaveBeenCalledTimes(2);
    expect((await service.status()).reason).toBe('unchanged_evidence');
    expect(JSON.stringify(rows)).not.toContain('No contextual bridge.');
  });

  it('records only compact quality aggregate from eligible narrative evidence', async () => {
    const { service, evidence, rows } = setup();
    evidence.collect.mockResolvedValue([...inputs, { id: 'narrative:3', kind: 'narrative', data: { quality: { passed: true, overall: 86 } } }]);

    await service.check();

    expect(rows[0].quality).toEqual({ eligibleDrafts: 1, averageOverall: 86 });
    expect(JSON.stringify(rows[0])).not.toContain('narrative body');
  });

  it('starts automatically only on Railway or explicit opt-in, with a kill switch', () => {
    expect(setup({}).service.enabled).toBe(false);
    expect(setup({ RAILWAY_ENVIRONMENT_ID: 'production' }).service.enabled).toBe(true);
    expect(setup({ RAILWAY_ENVIRONMENT_ID: 'production', AUTONOMOUS_LEARNING_ENABLED: 'false' }).service.enabled).toBe(false);
    expect(setup({ VERCEL: '1' }).service.enabled).toBe(false);
  });

  it('runs without a browser and schedules the next check after completion', async () => {
    jest.useFakeTimers();
    try {
      const { service, ai } = setup();
      service.onModuleInit();
      await jest.advanceTimersByTimeAsync(0);
      expect(ai.complete).toHaveBeenCalledTimes(2);
      expect((await service.status()).nextCheck).toBeDefined();
      await jest.advanceTimersByTimeAsync(300000);
      expect(ai.complete).toHaveBeenCalledTimes(2);
      service.onModuleDestroy();
    } finally { jest.useRealTimers(); }
  });

  it('never calls AI when disabled, evidence is insufficient, or quota is reached', async () => {
    const disabled = setup({}); await disabled.service.check(); expect(disabled.ai.complete).not.toHaveBeenCalled();
    const empty = setup(); empty.evidence.collect.mockResolvedValue([]); await empty.service.check();
    expect((await empty.service.status()).reason).toBe('insufficient_evidence');
    expect(empty.ai.complete).not.toHaveBeenCalled();
    const capped = setup(); capped.cycles.countDocuments.mockImplementation(async (query) => query.fingerprint ? 0 : 4); await capped.service.check();
    expect(capped.ai.complete).not.toHaveBeenCalled(); expect((await capped.service.status()).phase).toBe('quota');
  });

  it('backs off failures, stops after two daily attempts and retries on a new day', async () => {
    const { service, ai, rows, knowledge } = setup();
    ai.complete.mockRejectedValue(new ServiceUnavailableException('private body'));
    await service.check(); await service.check();
    expect(rows[0].reason).toBe('free_model_unavailable'); expect(ai.complete).toHaveBeenCalledTimes(1);
    rows[0].updatedAt = new Date(Date.now() - 16 * 60_000);
    await service.check(); await service.check();
    expect(ai.complete).toHaveBeenCalledTimes(2); expect(rows).toHaveLength(2);
    expect((await service.status()).reason).toBe('batch_daily_limit');
    expect(knowledge.createAutonomousLesson).not.toHaveBeenCalled(); expect(JSON.stringify(rows)).not.toContain('private body');
    rows.forEach((row) => { row.day = '2000-01-01'; row.updatedAt = new Date(0); });
    await service.check(); expect(ai.complete).toHaveBeenCalledTimes(3);
  });

  it('recovers a partial save on restart without another model call or duplicate lesson', async () => {
    const { service, restart, ai, rows, knowledge, cycles } = setup();
    knowledge.createAutonomousLesson.mockRejectedValueOnce(new Error('save interrupted after upsert'));
    await service.check(); expect(rows[0].phase).toBe('failed');
    knowledge.findAutonomousLesson.mockResolvedValue({ _id: 'saved', vectorStatus: 'pending' });
    await restart().check();
    expect(ai.complete).toHaveBeenCalledTimes(2);
    expect(cycles.updateOne).toHaveBeenCalledWith({ _id: rows[0]._id }, { $set: expect.objectContaining({ phase: 'complete', knowledgeId: 'saved' }) });
  });

  it('rejects model disagreement, malformed output, duplicate lessons and revoked approval', async () => {
    const disagreement = setup(); disagreement.ai.complete.mockImplementation(async (request) => ({ mode: 'live', model: 'model:free', content: JSON.stringify(request.task === 'internal-learning' ? candidate : { grounded: false }) }));
    await disagreement.service.check(); expect(disagreement.rows[0].reason).toBe('review_rejected');
    const malformed = setup(); malformed.ai.complete.mockResolvedValue({ mode: 'live', model: 'model:free', content: 'not json' });
    await malformed.service.check(); expect(malformed.rows[0].reason).toBe('invalid_model_output');
    expect(malformed.rows[0].phase).toBe('failed');
    const duplicate = setup(); duplicate.evidence.recentLessons.mockResolvedValue([candidate]);
    await duplicate.service.check(); expect(duplicate.rows[0].reason).toBe('no_valid_novel_lesson');
    const revoked = setup(); revoked.evidence.collect.mockResolvedValueOnce(inputs).mockResolvedValue([]);
    await revoked.service.check(); expect(revoked.rows[0].reason).toBe('sources_changed');
    for (const test of [disagreement, malformed, duplicate, revoked]) expect(test.knowledge.createAutonomousLesson).not.toHaveBeenCalled();
  });

  it('prevents overlapping runs and handles database failure without unhandled rejection', async () => {
    const { service, ai, cycles } = setup();
    await Promise.all([service.check(), service.check()]);
    expect(cycles.create).toHaveBeenCalledTimes(1); expect(ai.complete).toHaveBeenCalledTimes(2);
    cycles.updateMany.mockRejectedValue(new Error('private database details'));
    await service.check(); expect((await service.status()).reason).toBe('storage_unavailable');
  });
});
