import { KnowledgeService } from './knowledge.service';

describe('KnowledgeService hybrid retrieval', () => {
  it('keeps semantic order and appends lexical-only matches once', async () => {
    const records = [record('a', ['basket']), record('b', ['basket']), record('c', ['basket'])];
    const service = makeService(records, { ids: ['b', 'a'], failed: false });

    const result = await service.findRelevantWithMeta('basket');

    expect(result.records.map((item) => item._id)).toEqual(['b', 'a', 'c']);
    expect(result.metadata).toEqual({ mode: 'hybrid', semanticCount: 2, lexicalCount: 1, knowledgeIds: ['b', 'a', 'c'] });
  });

  it('uses lexical matches when semantic search fails', async () => {
    const service = makeService([record('a', ['basket'])], { ids: [], failed: true });

    const result = await service.findRelevantWithMeta('basket');

    expect(result.metadata.mode).toBe('lexical-fallback');
    expect(result.records).toHaveLength(1);
  });

  it('keeps semantic-only matches when lexical search adds nothing', async () => {
    const service = makeService([record('semantic', ['other'])], { ids: ['semantic'], failed: false });

    const result = await service.findRelevantWithMeta('basket');

    expect(result.metadata.mode).toBe('semantic');
    expect(result.records.map((item) => item._id)).toEqual(['semantic']);
  });

  it('uses recent records when neither query path has a match', async () => {
    const service = makeService([record('recent', ['other'])], { ids: [], failed: false });

    const result = await service.findRelevantWithMeta('x');

    expect(result.metadata.mode).toBe('recent-fallback');
    expect(result.metadata.knowledgeIds).toEqual(['recent']);
  });

  it('returns an empty result when the library has no records', async () => {
    const service = makeService([], { ids: [], failed: false });

    const result = await service.findRelevantWithMeta('basket');

    expect(result.metadata).toEqual({ mode: 'empty', semanticCount: 0, lexicalCount: 0, knowledgeIds: [] });
  });
});

function makeService(records: Array<{ _id: string; topics: string[] }>, vector: { ids: string[]; failed: boolean }) {
  const model = {
    find: jest.fn((filter: { _id?: { $in: string[] }; topics?: { $in: string[] } } = {}) => {
      const selected = filter._id ? records.filter((item) => filter._id?.$in.includes(item._id))
        : filter.topics ? records.filter((item) => item.topics.some((topic) => filter.topics?.$in.includes(topic))) : records;
      return query(selected);
    }),
  };
  const vectors = { searchWithStatus: jest.fn().mockResolvedValue(vector) };
  return new KnowledgeService(model as never, {} as never, vectors as never);
}

function query<T>(value: T[]) {
  return { sort: () => ({ limit: () => ({ lean: jest.fn().mockResolvedValue(value) }) }), limit: () => ({ lean: jest.fn().mockResolvedValue(value) }), lean: jest.fn().mockResolvedValue(value) };
}

function record(_id: string, topics: string[]) {
  return { _id, topics };
}
