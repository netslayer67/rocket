import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AiOrchestratorService } from '../ai/ai-orchestrator.service';
import { ImportKnowledgeDto } from './dto/import-knowledge.dto';
import { demoPattern, keywords, parsePattern, type KnowledgePattern } from './knowledge-pattern';
import { Knowledge } from './schemas/knowledge.schema';
import { VectorIndexService } from './vector-index.service';
import type { AiRetrievalMetadata } from '../ai/ai.types';
import { PersonasService } from '../personas/personas.service';

@Injectable()
export class KnowledgeService {
  constructor(
    @InjectModel(Knowledge.name) private readonly knowledge: Model<Knowledge>,
    private readonly ai: AiOrchestratorService,
    private readonly vectors: VectorIndexService,
    private readonly personas: PersonasService,
  ) {}

  async import(dto: ImportKnowledgeDto) {
    const personaId = await this.activeId();
    const result = await this.ai.complete({
      task: 'knowledge-extraction',
      system: 'Extract reusable Indonesian narrative patterns. Never reproduce source text. Return compact valid JSON only.',
      prompt: `Analyze this source and return {"topics":["..."],"hookType":"...","emotion":"...","narrativeType":"...","curiosityLevel":1-5,"linkPlacement":"opening|middle|ending|reply","patternSummary":"...","conflict":"...","persona":"...","style":"...","vocabulary":["..."],"informationGap":"...","discussionPattern":"...","authorityType":"...","ctaStyle":"...","naturalness":1-5,"lessonType":"positive|negative","diagnosis":"why the pattern works or fails","rootCause":"underlying cause","recommendedFix":"reusable fix","failureDimensions":["hook|persona|narrative|evidence|scene|curiosity|discussion|reference|link|reasoning|language"],"evidenceSources":["firsthand|user-confirmed|reference-metadata"]}.

SOURCE:\n${dto.content}`,
      maxTokens: 1000,
      json: true,
    });
    const pattern = result.mode === 'demo' ? demoPattern(dto.content) : parsePattern(result.content);
    const record = await this.knowledge.create({ sourceLabel: dto.sourceLabel, sourceUrl: dto.sourceUrl, personaId, ...pattern });
    const indexed = await this.vectors.index(record);
    record.vectorStatus = indexed.status;
    record.embeddingModel = indexed.embeddingModel;
    await record.save();
    return record;
  }

  async findAll() {
    const active = await this.personas.findActive();
    if (!active) return [];
    return this.knowledge.find({ personaId: active._id }).sort({ createdAt: -1 }).limit(30).lean();
  }

  async createLesson(input: { sourceLabel: string; sourceUrl?: string } & KnowledgePattern, personaId: string, freeOnly = false) {
    await this.assertActive(personaId);
    const existing = await this.knowledge.findOne({ sourceLabel: input.sourceLabel, personaId });
    if (existing) return existing;
    const record = await this.knowledge.create({ ...input, personaId });
    const indexed = await this.vectors.index(record, freeOnly);
    record.vectorStatus = indexed.status;
    record.embeddingModel = indexed.embeddingModel;
    await record.save();
    return record;
  }

  async reindex() {
    // ponytail: synchronous for early libraries; move to BullMQ once reindexing becomes long-running.
    const active = await this.personas.findActive();
    if (!active) return { total: 0, indexed: 0, pending: 0 };
    const records = await this.knowledge.find({ personaId: active._id }).lean();
    let indexed = 0;
    let pending = 0;
    for (const record of records) {
      const result = await this.vectors.index(record);
      await this.knowledge.updateOne({ _id: record._id }, { vectorStatus: result.status, embeddingModel: result.embeddingModel });
      result.status === 'ready' ? indexed++ : pending++;
    }
    return { total: records.length, indexed, pending };
  }

  async createAutonomousLesson(pattern: KnowledgePattern, learningKey: string, evidenceIds: string[], personaId: string) {
    await this.assertActive(personaId);
    const record = await this.knowledge.findOneAndUpdate({ learningKey, personaId }, { $setOnInsert: {
      ...pattern, personaId, sourceLabel: `Internal synthesis ${learningKey.slice(0, 16)}`, learningKey, evidenceIds, origin: 'autonomous',
    } }, { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true });
    if (record.vectorStatus === 'ready') return record;
    const indexed = await this.vectors.index(record, true);
    record.vectorStatus = indexed.status;
    record.embeddingModel = indexed.embeddingModel;
    await record.save();
    return record;
  }

  findAutonomousLesson(learningKey: string, personaId: string) {
    return this.knowledge.findOne({ learningKey, personaId }).lean();
  }

  async findRelevant(topic: string, personaId: string) {
    return (await this.findRelevantWithMeta(topic, personaId)).records;
  }

  async findRelevantWithMeta(topic: string, personaId: string) {
    const semanticResult = await this.vectors.searchWithStatus(topic);
    const semanticRecords = await this.recordsByIds(semanticResult.ids, personaId);
    const lexicalRecords = await this.lexicalMatches(topic, personaId);
    const semanticIds = new Set(semanticRecords.map((record) => String(record._id)));
    const lexicalOnly = lexicalRecords.filter((record) => !semanticIds.has(String(record._id)));
    const recent = semanticRecords.length || lexicalOnly.length ? [] : await this.recentMatches(personaId);
    const records = [...semanticRecords, ...lexicalOnly, ...recent].slice(0, 8);
    const mode: AiRetrievalMetadata['mode'] = records.length
      ? semanticRecords.length && lexicalOnly.length ? 'hybrid'
        : semanticRecords.length ? 'semantic'
          : lexicalOnly.length ? 'lexical-fallback' : recent.length ? 'recent-fallback' : 'empty'
      : 'empty';
    return { records, metadata: { mode, semanticCount: semanticRecords.length, lexicalCount: lexicalOnly.length, knowledgeIds: records.map((record) => String(record._id)).slice(0, 8) } satisfies AiRetrievalMetadata };
  }

  private async recordsByIds(ids: string[], personaId: string) {
    if (!ids.length) return [];
    const records = await this.knowledge.find({ _id: { $in: ids }, personaId }).lean();
    const byId = new Map(records.map((record) => [String(record._id), record]));
    return ids.map((id) => byId.get(id)).filter((record): record is NonNullable<typeof record> => Boolean(record));
  }

  private async lexicalMatches(topic: string, personaId: string) {
    const words = keywords(topic);
    return words.length
      ? await this.knowledge.find({ topics: { $in: words }, personaId }).sort({ createdAt: -1 }).limit(4).lean()
      : [];
  }

  private recentMatches(personaId: string) {
    return this.knowledge.find({ personaId }).sort({ createdAt: -1 }).limit(3).lean();
  }

  private async activeId() {
    const active = await this.personas.findActive();
    if (!active) throw new NotFoundException('Persona aktif belum dibuat.');
    return String(active._id);
  }

  private async assertActive(personaId: string) {
    if (await this.activeId() !== personaId) throw new NotFoundException('Persona aktif tidak ditemukan.');
  }
}
