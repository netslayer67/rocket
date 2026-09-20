import { KnowledgeService } from './knowledge.service';
import { KnowledgeSchema } from './schemas/knowledge.schema';
import { patternContext } from '../narratives/narrative-parsers';

describe('Idempotent autonomous knowledge persistence', () => {
  it('passes provisional provenance into narrative generation instead of implying empirical proof', () => {
    const context = patternContext({ origin: 'autonomous', evidenceIds: ['feedback:a', 'dna:b'] } as never);
    expect(context.caveat).toContain('not empirical evidence');
    expect(context.evidenceIds).toEqual(['feedback:a', 'dna:b']);
  });
  it('atomically reuses the fingerprint key and indexes only with free models', async () => {
    const record = { _id: 'saved', vectorStatus: 'pending', save: jest.fn() };
    const model = { findOneAndUpdate: jest.fn().mockResolvedValue(record) };
    const vectors = { index: jest.fn().mockResolvedValue({ status: 'ready', embeddingModel: 'embed:free' }) };
    const service = new KnowledgeService(model as never, {} as never, vectors as never);
    await service.createAutonomousLesson({ patternSummary: 'metadata' } as never, 'fingerprint', ['feedback:a', 'dna:b']);
    expect(model.findOneAndUpdate).toHaveBeenCalledWith({ learningKey: 'fingerprint' }, { $setOnInsert: expect.objectContaining({
      origin: 'autonomous', evidenceIds: ['feedback:a', 'dna:b'], learningKey: 'fingerprint',
    }) }, expect.objectContaining({ upsert: true, new: true, runValidators: true }));
    expect(vectors.index).toHaveBeenCalledWith(record, true);
    await service.createAutonomousLesson({ patternSummary: 'retry' } as never, 'fingerprint', ['feedback:a', 'dna:b']);
    expect(vectors.index).toHaveBeenCalledTimes(1);
    expect(KnowledgeSchema.indexes()).toEqual(expect.arrayContaining([
      [expect.objectContaining({ learningKey: 1 }), expect.objectContaining({ unique: true, sparse: true })],
    ]));
  });
});
