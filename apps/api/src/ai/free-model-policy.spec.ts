import { AiOrchestratorService } from './ai-orchestrator.service';
import { freeProvider, personaModels } from './free-model-policy';

describe('Autonomous free-only AI routing', () => {
  const originalFetch = global.fetch;
  const request = { task: 'internal-learning' as const, system: 'metadata only', prompt: 'private evidence', maxTokens: 20, freeOnly: true };
  function setup(values: Record<string, string> = {}) {
    const config = { get: (key: string, fallback?: string) => values[key] ?? fallback };
    const runs = { create: jest.fn().mockResolvedValue(undefined) };
    return { service: new AiOrchestratorService(config as never, runs as never), runs };
  }
  afterEach(() => { global.fetch = originalFetch; });

  it('uses only approved learning fallbacks and never logs provider error bodies', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 429, text: () => 'private evidence' });
    const { service, runs } = setup({ OPENROUTER_API_KEY: 'test', OPENROUTER_LEARNING_MODELS: 'openrouter/free,poolside/laguna-s-2.1:free,nvidia/nemotron-3-super-120b-a12b:free,nex-agi/nex-n2.5-mini:free,nex-agi/nex-n2.5-pro:free' });
    await expect(service.complete(request)).rejects.toThrow('Free model unavailable');
    expect(global.fetch).toHaveBeenCalledTimes(3);
    for (const [, options] of (global.fetch as jest.Mock).mock.calls) {
      expect(JSON.parse(options.body).provider).toEqual(freeProvider);
      expect(JSON.parse(options.body).model).toMatch(/^(nvidia\/nemotron-3-super-120b-a12b|nex-agi\/nex-n2.5-(mini|pro)):free$/);
      expect(options.signal).toBeDefined();
    }
    expect(runs.create).not.toHaveBeenCalled();
  });

  it('does not fall back to demo or a paid-only configuration', async () => {
    global.fetch = jest.fn();
    await expect(setup().service.complete(request)).rejects.toThrow('requires an OpenRouter key');
    await expect(setup({ OPENROUTER_API_KEY: 'test', OPENROUTER_LEARNING_MODELS: 'paid/model' }).service.complete(request)).rejects.toThrow();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('rejects the dynamic free router and keeps private prompts out of telemetry', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ choices: [{ message: { content: '{}' } }] }) });
    const { service, runs } = setup({ OPENROUTER_API_KEY: 'test', OPENROUTER_LEARNING_MODELS: 'openrouter/free' });
    await expect(service.complete(request)).rejects.toThrow('No configured model is available');
    expect(global.fetch).not.toHaveBeenCalled();
    expect(runs.create).not.toHaveBeenCalled();
  });

  it('blocks paid embedding before network access and caps free provider price', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [{ embedding: [0.1] }] }) });
    await expect(setup({ OPENROUTER_EMBEDDING_MODEL: 'paid/embed' }).service.embed('text', 'search_document', true)).rejects.toThrow('Paid embedding blocked');
    expect(global.fetch).not.toHaveBeenCalled();
    await setup({ OPENROUTER_API_KEY: 'test' }).service.embed('text', 'search_document', true);
    expect(JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body).provider).toEqual(freeProvider);
  });

  it('rejects truncated output, falls back within free models and records the resolved model', async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ choices: [{ finish_reason: 'length', message: { content: '{' } }] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ model: 'resolved:free', choices: [{ finish_reason: 'stop', message: { content: '{}' } }] }) });
    const { service, runs } = setup({ OPENROUTER_API_KEY: 'test', OPENROUTER_LEARNING_MODELS: 'nvidia/nemotron-3-super-120b-a12b:free,nex-agi/nex-n2.5-mini:free' });
    expect((await service.complete(request)).model).toBe('resolved:free');
    expect(runs.create).toHaveBeenCalledTimes(1);
    expect(JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body).reasoning).toEqual({ effort: 'low', exclude: true });
    expect(JSON.parse((global.fetch as jest.Mock).mock.calls[1][1].body).reasoning).toEqual({ effort: 'none', exclude: true });
  });

  it('skips invalid persona routes and falls back after a voice gate rejection without retaining output', async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ model: 'first:free', choices: [{ message: { content: '{"draft":"generic"}' } }] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ model: 'second:free', choices: [{ message: { content: '{"draft":"naya"}' } }] }) });
    const { service, runs } = setup({ OPENROUTER_API_KEY: 'test', OPENROUTER_PERSONA_MODELS: 'openrouter/free,paid/model,first:free,second:free' });
    const result = await service.complete({ task: 'narrative', system: 'voice contract', prompt: 'private draft input', maxTokens: 20, personaModels: true,
      outputGate: (content) => content.includes('generic') ? 'voice-quality' : 'accepted' });

    expect(result.model).toBe('second:free');
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body)).toMatchObject({ model: 'first:free', provider: freeProvider });
    expect(runs.create.mock.calls.map(([entry]) => entry)).toEqual(expect.arrayContaining([
      expect.objectContaining({ model: 'first:free', accepted: false, rejection: 'voice-quality' }),
      expect.objectContaining({ model: 'second:free', accepted: true }),
    ]));
    expect(JSON.stringify(runs.create.mock.calls)).not.toContain('private draft input');
    expect(JSON.stringify(runs.create.mock.calls)).not.toContain('generic');
  });

  it('bounds named persona models to four free candidates', () => {
    expect(personaModels('openrouter/free,paid/model,a:free,a:free,b:free,c:free,d:free,e:free'))
      .toEqual(['a:free', 'b:free', 'c:free', 'd:free']);
  });
});
