import { ConfigService } from '@nestjs/config';
import { AiOrchestratorService } from '../ai/ai-orchestrator.service';
import { VectorIndexService } from './vector-index.service';

describe('VectorIndexService', () => {
  const originalFetch = global.fetch;

  afterEach(() => { global.fetch = originalFetch; });

  it('creates a collection then indexes only the Mongo knowledge ID payload', async () => {
    const fetchMock = jest.fn()
      .mockResolvedValueOnce(new Response('', { status: 404 }))
      .mockResolvedValueOnce(json({ result: true }))
      .mockResolvedValueOnce(json({ result: { status: 'completed' } }));
    global.fetch = fetchMock as unknown as typeof fetch;
    const service = new VectorIndexService(config(), ai());

    const result = await service.index(pattern());

    expect(result).toEqual({ status: 'ready', embeddingModel: 'test-embed' });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(String(fetchMock.mock.calls[2][1].body)).toContain('knowledgeId');
    expect(String(fetchMock.mock.calls[2][1].body)).not.toContain('raw source');
  });
});

function config() {
  return { get: (key: string, fallback?: string) => ({ QDRANT_URL: 'http://qdrant', QDRANT_COLLECTION: 'knowledge' }[key] ?? fallback) } as ConfigService;
}

function ai() {
  return { embed: jest.fn().mockResolvedValue({ vector: [0.1, 0.2], model: 'test-embed' }) } as unknown as AiOrchestratorService;
}

function pattern() {
  return { _id: 'abc', topics: ['narasi'], hookType: 'hook', emotion: 'penasaran', narrativeType: 'insight', curiosityLevel: 3, linkPlacement: 'ending', patternSummary: 'summary', conflict: 'conflict', persona: 'persona', style: 'style', vocabulary: [], informationGap: 'gap', discussionPattern: 'discussion', authorityType: 'observation', ctaStyle: 'reference', naturalness: 4 };
}

function json(value: unknown) {
  return new Response(JSON.stringify(value), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
