import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AiOrchestratorService } from '../ai/ai-orchestrator.service';
import { ImportKnowledgeDto } from './dto/import-knowledge.dto';
import { demoPattern, keywords, parsePattern } from './knowledge-pattern';
import { Knowledge } from './schemas/knowledge.schema';
import { VectorIndexService } from './vector-index.service';

@Injectable()
export class KnowledgeService {
  constructor(
    @InjectModel(Knowledge.name) private readonly knowledge: Model<Knowledge>,
    private readonly ai: AiOrchestratorService,
    private readonly vectors: VectorIndexService,
  ) {}

  async import(dto: ImportKnowledgeDto) {
    const result = await this.ai.complete({
      task: 'knowledge-extraction',
      system: 'Extract reusable Indonesian narrative patterns. Never reproduce source text. Return compact valid JSON only.',
      prompt: `Analyze this source and return {"topics":["..."],"hookType":"...","emotion":"...","narrativeType":"...","curiosityLevel":1-5,"linkPlacement":"opening|middle|ending|reply","patternSummary":"...","conflict":"...","persona":"...","style":"...","vocabulary":["..."],"informationGap":"...","discussionPattern":"...","authorityType":"...","ctaStyle":"...","naturalness":1-5,"lessonType":"positive|negative","diagnosis":"why the pattern works or fails","rootCause":"underlying cause","recommendedFix":"reusable fix","failureDimensions":["hook|persona|narrative|evidence|scene|curiosity|discussion|reference|link|reasoning|language"],"evidenceSources":["firsthand|user-confirmed|reference-metadata"]}.

SOURCE:\n${dto.content}`,
      maxTokens: 1000,
      json: true,
    });
    const pattern = result.mode === 'demo' ? demoPattern(dto.content) : parsePattern(result.content);
    const record = await this.knowledge.create({ sourceLabel: dto.sourceLabel, sourceUrl: dto.sourceUrl, ...pattern });
    const indexed = await this.vectors.index(record);
    record.vectorStatus = indexed.status;
    record.embeddingModel = indexed.embeddingModel;
    await record.save();
    return record;
  }

  findAll() {
    return this.knowledge.find().sort({ createdAt: -1 }).limit(30).lean();
  }

  async reindex() {
    // ponytail: synchronous for early libraries; move to BullMQ once reindexing becomes long-running.
    const records = await this.knowledge.find().lean();
    let indexed = 0;
    let pending = 0;
    for (const record of records) {
      const result = await this.vectors.index(record);
      await this.knowledge.updateOne({ _id: record._id }, { vectorStatus: result.status, embeddingModel: result.embeddingModel });
      result.status === 'ready' ? indexed++ : pending++;
    }
    return { total: records.length, indexed, pending };
  }

  async findRelevant(topic: string) {
    const semantic = await this.vectors.search(topic);
    if (semantic.length) {
      const records = await this.knowledge.find({ _id: { $in: semantic } }).lean();
      const byId = new Map(records.map((record) => [String(record._id), record]));
      const ordered = semantic.map((id) => byId.get(id)).filter((record): record is NonNullable<typeof record> => Boolean(record));
      if (ordered.length) return ordered;
    }
    return this.lexicalFallback(topic);
  }

  private async lexicalFallback(topic: string) {
    const words = keywords(topic);
    const matches = words.length
      ? await this.knowledge.find({ topics: { $in: words } }).sort({ createdAt: -1 }).limit(4).lean()
      : [];
    return matches.length ? matches : this.knowledge.find().sort({ createdAt: -1 }).limit(3).lean();
  }
}
