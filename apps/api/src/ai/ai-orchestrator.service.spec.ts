import { AiOrchestratorService } from './ai-orchestrator.service';

describe('AiOrchestratorService retrieval telemetry', () => {
  it('stores bounded retrieval metadata without source content in demo mode', async () => {
    const runs = { create: jest.fn().mockResolvedValue(undefined) };
    const config = { get: jest.fn().mockReturnValue(undefined) };
    const service = new AiOrchestratorService(config as never, runs as never);
    const retrieval = { mode: 'hybrid' as const, semanticCount: 1, lexicalCount: 1, knowledgeIds: ['one', 'two'] };

    await service.complete({ task: 'narrative', system: 'system', prompt: 'raw source must not be logged', maxTokens: 10, retrieval });

    expect(runs.create).toHaveBeenCalledWith(expect.objectContaining({ retrieval }));
    expect(runs.create.mock.calls[0][0]).not.toHaveProperty('prompt');
    expect(runs.create.mock.calls[0][0]).not.toHaveProperty('source');
  });
});
