import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiOrchestratorService } from '../ai/ai-orchestrator.service';
import { retrievalText, type KnowledgePattern } from './knowledge-pattern';
import { vectorPointId } from './vector-id';

type IndexedKnowledge = KnowledgePattern & { _id: unknown };
type VectorResult = { status: 'ready' | 'pending'; embeddingModel?: string };
type CollectionResponse = { result?: { config?: { params?: { vectors?: { size?: number } } } } };
type QueryPoint = { payload?: { knowledgeId?: unknown } };
type QueryResponse = { result?: { points?: QueryPoint[] } | QueryPoint[] };

@Injectable()
export class VectorIndexService {
  constructor(private readonly config: ConfigService, private readonly ai: AiOrchestratorService) {}

  async index(knowledge: IndexedKnowledge): Promise<VectorResult> {
    try {
      const embedding = await this.ai.embed(retrievalText(knowledge), 'search_document');
      await this.ensureCollection(embedding.vector.length);
      await this.request(`/collections/${this.collection}/points?wait=true`, {
        method: 'PUT',
        body: { points: [{ id: vectorPointId(String(knowledge._id)), vector: embedding.vector, payload: { knowledgeId: String(knowledge._id) } }] },
      });
      return { status: 'ready', embeddingModel: embedding.model };
    } catch {
      return { status: 'pending' };
    }
  }

  async search(topic: string) {
    try {
      const embedding = await this.ai.embed(topic, 'search_query');
      await this.ensureCollection(embedding.vector.length);
      const body = await this.request<QueryResponse>(`/collections/${this.collection}/points/query`, {
        method: 'POST', body: { query: embedding.vector, limit: 4, with_payload: true },
      });
      const result = body.result;
      const points = Array.isArray(result) ? result : result?.points ?? [];
      return points.map((point) => point.payload?.knowledgeId).filter((id): id is string => typeof id === 'string');
    } catch {
      return [];
    }
  }

  private get collection() {
    return this.config.get<string>('QDRANT_COLLECTION', 'rocket_knowledge');
  }

  private async ensureCollection(size: number) {
    const path = `/collections/${this.collection}`;
    const response = await fetch(`${this.url}${path}`, { headers: this.headers() });
    if (response.status === 404) {
      await this.request(path, { method: 'PUT', body: { vectors: { size, distance: 'Cosine' } } });
      return;
    }
    if (!response.ok) throw new Error(await response.text());
    const body = (await response.json()) as CollectionResponse;
    const existing = body.result?.config?.params?.vectors?.size;
    if (existing !== size) throw new Error('Qdrant collection must use the current unnamed embedding dimension');
  }

  private async request<T = unknown>(path: string, options: { method: string; body?: unknown }) {
    const response = await fetch(`${this.url}${path}`, {
      method: options.method, headers: this.headers(), body: options.body ? JSON.stringify(options.body) : undefined,
    });
    if (!response.ok) throw new Error(await response.text());
    return (await response.json()) as T;
  }

  private get url() {
    const url = this.config.get<string>('QDRANT_URL');
    if (!url) throw new Error('QDRANT_URL is not configured');
    return url.replace(/\/$/, '');
  }

  private headers() {
    const apiKey = this.config.get<string>('QDRANT_API_KEY');
    return { 'Content-Type': 'application/json', ...(apiKey ? { 'api-key': apiKey } : {}) };
  }
}
