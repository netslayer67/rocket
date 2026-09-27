import { AiOrchestratorService } from './ai-orchestrator.service';

describe('9Router persona chat routing', () => {
  const originalFetch = global.fetch;
  const request = { task: 'narrative' as const, system: 'voice contract', prompt: 'private draft', maxTokens: 128, personaModels: true };

  function setup(values: Record<string, string> = {}) {
    const config = { get: (key: string, fallback?: string) => values[key] ?? fallback };
    const runs = { create: jest.fn().mockResolvedValue(undefined) };
    return { service: new AiOrchestratorService(config as never, runs as never), runs };
  }

  afterEach(() => { global.fetch = originalFetch; });

  it('prefers the configured 9Router route, models, and non-streaming JSON response', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ model: 'gemini/gemini-3.8-flash', choices: [{ message: { content: '{"title":"Naya","body":"draft"}' } }] }) });
    const { service } = setup({
      NINE_ROUTER_BASE_URL: 'https://router.example/v1/',
      NINE_ROUTER_API_KEY: 'nine-key',
      NINE_ROUTER_PERSONA_MODELS: 'gemini/gemini-3.8-flash,backup/model',
    });

    await expect(service.complete(request)).resolves.toMatchObject({ model: 'gemini/gemini-3.8-flash' });

    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    const payload = JSON.parse(options.body);
    expect(url).toBe('https://router.example/v1/chat/completions');
    expect(payload).toMatchObject({ model: 'gemini/gemini-3.8-flash', stream: false });
    expect(payload).not.toHaveProperty('provider');
    expect(options.headers).not.toHaveProperty('HTTP-Referer');
  });

  it('uses the next explicit 9Router candidate after a safe request rejection', async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: false, status: 404 })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ model: 'second/model', choices: [{ message: { content: '{}' } }] }) });
    const { service, runs } = setup({
      NINE_ROUTER_BASE_URL: 'https://router.example/v1', NINE_ROUTER_API_KEY: 'nine-key',
      NINE_ROUTER_PERSONA_MODELS: 'first/model,second/model',
    });

    await expect(service.complete(request)).resolves.toMatchObject({ model: 'second/model' });

    expect((global.fetch as jest.Mock).mock.calls.map(([, options]) => JSON.parse(options.body).model)).toEqual(['first/model', 'second/model']);
    expect(runs.create.mock.calls.map(([entry]) => entry.rejection)).toEqual(['http-404', undefined]);
  });

  it('rejects partial 9Router configuration without sending a provider request', async () => {
    global.fetch = jest.fn();
    const { service } = setup({ NINE_ROUTER_BASE_URL: 'https://router.example/v1' });

    await expect(service.complete(request)).rejects.toThrow('9Router chat requires NINE_ROUTER_BASE_URL and NINE_ROUTER_API_KEY');

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('keeps embeddings on OpenRouter while 9Router chat is configured', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [{ embedding: [0.1] }] }) });
    const { service } = setup({
      OPENROUTER_API_KEY: 'openrouter-key', NINE_ROUTER_BASE_URL: 'https://router.example/v1', NINE_ROUTER_API_KEY: 'nine-key',
      NINE_ROUTER_PERSONA_MODELS: 'gemini/gemini-3.8-flash',
    });

    await service.embed('metadata only', 'search_query');

    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('https://openrouter.ai/api/v1/embeddings');
    expect(options.headers.Authorization).toBe('Bearer openrouter-key');
  });
});
