import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { createHash } from 'node:crypto';
import { Model } from 'mongoose';
import { AiRequest, AiResult, EmbeddingResult } from './ai.types';
import { AiRun } from './schemas/ai-run.schema';

type OpenRouterResponse = {
  choices?: Array<{ message?: { content?: string } }>;
  usage?: { prompt_tokens?: number; completion_tokens?: number };
};

type EmbeddingResponse = { data?: Array<{ embedding?: number[] }>; usage?: { prompt_tokens?: number } };
type RunResult = Pick<AiResult, 'model' | 'cached' | 'mode' | 'inputTokens' | 'outputTokens'>;

@Injectable()
export class AiOrchestratorService {
  private readonly cache = new Map<string, AiResult>();
  private readonly embeddingCache = new Map<string, EmbeddingResult>();

  constructor(
    private readonly config: ConfigService,
    @InjectModel(AiRun.name) private readonly runs: Model<AiRun>,
  ) {}

  async complete(request: AiRequest): Promise<AiResult> {
    const inputHash = createHash('sha256')
      .update(JSON.stringify(request))
      .digest('hex');
    const cached = this.cache.get(inputHash);

    if (cached) {
      const result = { ...cached, cached: true };
      await this.log(request.task, inputHash, result);
      return result;
    }

    const apiKey = this.config.get<string>('OPENROUTER_API_KEY');
    if (!apiKey) {
      const result: AiResult = {
        content: '',
        model: 'local-demo',
        cached: false,
        mode: 'demo',
      };
      await this.log(request.task, inputHash, result);
      return result;
    }

    const models = this.config
      .get<string>(
        'OPENROUTER_MODELS',
        'openai/gpt-oss-20b:free,google/gemma-3-27b-it:free,meta-llama/llama-3.3-70b-instruct:free',
      )
      .split(',')
      .map((model) => model.trim())
      .filter(Boolean);

    let lastError = 'No model configured';
    for (const model of models) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: this.headers(apiKey),
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: request.system },
              { role: 'user', content: request.prompt },
            ],
            max_tokens: request.maxTokens,
            temperature: 0.7,
            response_format: request.json ? { type: 'json_object' } : undefined,
          }),
        });
        if (!response.ok) throw new Error(await response.text());

        const body = (await response.json()) as OpenRouterResponse;
        const content = body.choices?.[0]?.message?.content?.trim();
        if (!content) throw new Error('Model returned no content');

        const result: AiResult = {
          content,
          model,
          cached: false,
          mode: 'live',
          inputTokens: body.usage?.prompt_tokens,
          outputTokens: body.usage?.completion_tokens,
        };
        this.cache.set(inputHash, result);
        await this.log(request.task, inputHash, result);
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
      }
    }

    throw new ServiceUnavailableException(`No configured model is available: ${lastError}`);
  }

  async embed(input: string, inputType: 'search_document' | 'search_query'): Promise<EmbeddingResult> {
    const model = this.config.get<string>('OPENROUTER_EMBEDDING_MODEL', 'nvidia/nemotron-3-embed-1b:free');
    const inputHash = createHash('sha256').update(`${model}:${inputType}:${input}`).digest('hex');
    const cached = this.embeddingCache.get(inputHash);
    if (cached) {
      const result = { ...cached, cached: true };
      await this.log('knowledge-embedding', inputHash, result);
      return result;
    }

    const apiKey = this.config.get<string>('OPENROUTER_API_KEY');
    if (!apiKey) throw new ServiceUnavailableException('OPENROUTER_API_KEY is required for semantic retrieval');

    const response = await fetch('https://openrouter.ai/api/v1/embeddings', {
      method: 'POST',
      headers: this.headers(apiKey),
      body: JSON.stringify({ model, input, input_type: this.embeddingInputType(inputType), encoding_format: 'float' }),
    });
    if (!response.ok) throw new ServiceUnavailableException(`Embedding request failed: ${await response.text()}`);

    const body = (await response.json()) as EmbeddingResponse;
    const vector = body.data?.[0]?.embedding;
    if (!vector?.length) throw new ServiceUnavailableException('Embedding model returned no vector');
    const result: EmbeddingResult = { vector, model, cached: false, mode: 'live', inputTokens: body.usage?.prompt_tokens };
    this.embeddingCache.set(inputHash, result);
    await this.log('knowledge-embedding', inputHash, result);
    return result;
  }

  private headers(apiKey: string) {
    return {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': this.config.get<string>('OPENROUTER_SITE_URL', 'http://localhost:3000'),
      'X-Title': 'Rocket Project',
    };
  }

  private embeddingInputType(inputType: 'search_document' | 'search_query') {
    return inputType === 'search_document' ? 'passage' : 'query';
  }

  private async log(task: string, inputHash: string, result: RunResult) {
    await this.runs.create({
      task,
      model: result.model,
      inputHash,
      cached: result.cached,
      demo: result.mode === 'demo',
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
    });
  }
}
