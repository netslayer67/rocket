import { acceptsInternalLesson, parseInternalLesson } from './internal-lesson';
import { evidenceFingerprint, InternalEvidenceService } from './internal-evidence.service';

const evidence = [
  { id: 'feedback:1', kind: 'feedback' as const, data: { notes: 'Contextual link missing; explain relevance.' } },
  { id: 'dna:2', kind: 'dna' as const, data: { patternSummary: 'Keep reference relevant to observed question.' } },
];
const lesson = {
  lessonType: 'positive', topics: ['reference'], patternSummary: 'Tie a reference to the question raised by the observed scene.',
  diagnosis: 'A question gives context for the reference.', rootCause: 'Relevance is visible before the link.',
  recommendedFix: 'Explain which question the reference helps explore, when relevant to this scene.', failureDimensions: [],
  evidenceIds: ['feedback:1', 'dna:2'], hookType: 'observation', emotion: 'curiosity', narrativeType: 'discussion',
  curiosityLevel: 3, naturalness: 4, linkPlacement: 'ending',
};

describe('Internal diagnosis validation', () => {
  it('accepts positive and negative contextual diagnoses with provenance', () => {
    expect(parseInternalLesson(JSON.stringify(lesson), evidence)?.pattern.lessonType).toBe('positive');
    expect(parseInternalLesson(JSON.stringify({ ...lesson, lessonType: 'negative', failureDimensions: ['reference'] }), evidence)?.pattern.lessonType).toBe('negative');
    expect(parseInternalLesson(JSON.stringify(lesson), evidence)?.pattern.evidenceSources).toEqual(lesson.evidenceIds);
  });

  it.each([
    { rootCause: '' }, { evidenceIds: ['unknown', 'dna:2'] }, { evidenceIds: ['dna:2', 'dna:2'] },
    { lessonType: 'negative', failureDimensions: [] }, { diagnosis: 'x'.repeat(701) }, { topics: [] }, { naturalness: '4' },
  ])('rejects missing support or invalid metadata %j', (change) => {
    expect(parseInternalLesson(JSON.stringify({ ...lesson, ...change }), evidence)).toBeNull();
  });

  it('rejects a no-novelty result and copied narrative passages', () => {
    expect(parseInternalLesson('{"skip":true}', evidence)).toBeNull();
    const passage = 'This is a source passage which must not be saved as extracted knowledge. '.repeat(2);
    const inputs = [...evidence, { id: 'narrative:3', kind: 'narrative' as const, data: { excerpt: passage } }];
    expect(parseInternalLesson(JSON.stringify({ ...lesson, patternSummary: passage }), inputs)).toBeNull();
  });

  it('requires all independent review gates to be literal true', () => {
    const review = { grounded: true, novel: true, nonContradictory: true, contextual: true };
    expect(acceptsInternalLesson(JSON.stringify(review))).toBe(true);
    for (const key of Object.keys(review)) expect(acceptsInternalLesson(JSON.stringify({ ...review, [key]: false }))).toBe(false);
    expect(acceptsInternalLesson('{"grounded":"true"}')).toBe(false);
  });

  it('fingerprints content changes without storing source text in the fingerprint', () => {
    expect(evidenceFingerprint(evidence)).toMatch(/^[a-f0-9]{64}$/);
    expect(evidenceFingerprint(evidence)).not.toBe(evidenceFingerprint(evidence.slice(1)));
  });
});

describe('Internal evidence selection', () => {
  function model(records: unknown[]) {
    const query = { sort: jest.fn().mockReturnThis(), limit: jest.fn().mockReturnThis(), lean: jest.fn().mockResolvedValue(records) };
    return { find: jest.fn(() => query), query };
  }

  it('queries only approved inputs, excludes autonomous and duplicated feedback DNA, and bounds each source', async () => {
    const feedback = model([{ _id: 'f', narrativeId: 'n', lessonType: 'negative', scores: { reference: 2 }, notes: 'bounded' }]);
    const knowledge = model([{ _id: 'k', topics: ['topic'], patternSummary: 'metadata' }]);
    const narratives = model([{ _id: 'n', topic: 'topic', title: 'title', body: 'x'.repeat(3000), linkPlacement: 'ending' }]);
    const service = new InternalEvidenceService(feedback as never, knowledge as never, narratives as never);
    const result = await service.collect('active');
    expect(feedback.find).toHaveBeenCalledWith({ approvedForLearning: true, personaId: 'active' });
    expect(knowledge.find).toHaveBeenCalledWith({ personaId: 'active', origin: { $ne: 'autonomous' }, sourceLabel: { $not: /^Feedback lesson / } });
    expect(narratives.find).toHaveBeenCalledWith({ personaId: 'active', status: 'approved' });
    for (const source of [feedback, knowledge, narratives]) expect(source.query.limit).toHaveBeenCalledWith(6);
    expect(String(result.find((item) => item.kind === 'narrative')?.data.excerpt)).toHaveLength(1200);
  });
});
