export type AiTask = 'knowledge-extraction' | 'knowledge-embedding' | 'narrative' | 'reference-suggestion' | 'review';

export interface AiRequest {
  task: AiTask;
  system: string;
  prompt: string;
  maxTokens: number;
  json?: boolean;
}

export interface AiResult {
  content: string;
  model: string;
  cached: boolean;
  mode: 'live' | 'demo';
  inputTokens?: number;
  outputTokens?: number;
}

export interface EmbeddingResult {
  vector: number[];
  model: string;
  cached: boolean;
  mode: 'live';
  inputTokens?: number;
}
