export type AiTask = 'knowledge-extraction' | 'knowledge-embedding' | 'narrative' | 'reference-suggestion' | 'review';

export interface AiRequest {
  task: AiTask;
  system: string;
  prompt: string;
  maxTokens: number;
  json?: boolean;
  retrieval?: AiRetrievalMetadata;
}

export type AiRetrievalMetadata = {
  mode: 'hybrid' | 'semantic' | 'lexical-fallback' | 'recent-fallback' | 'empty';
  semanticCount: number;
  lexicalCount: number;
  knowledgeIds: string[];
};

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
