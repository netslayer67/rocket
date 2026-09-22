export type AiTask = 'knowledge-extraction' | 'knowledge-embedding' | 'narrative' | 'reference-suggestion' | 'review' | 'internal-learning' | 'internal-learning-review';
export type AiGateResult = 'accepted' | 'invalid-output' | 'voice-quality';

export interface AiRequest {
  task: AiTask;
  system: string;
  prompt: string;
  maxTokens: number;
  json?: boolean;
  freeOnly?: boolean;
  personaModels?: boolean;
  outputGate?: (content: string) => AiGateResult;
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
