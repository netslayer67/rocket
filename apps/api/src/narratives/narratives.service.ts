import { BadRequestException, Injectable, NotFoundException, Optional } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AiOrchestratorService } from '../ai/ai-orchestrator.service';
import { KnowledgeService } from '../knowledge/knowledge.service';
import { PersonasService } from '../personas/personas.service';
import { ThreadsService } from '../threads/threads.service';
import { GenerateNarrativeDto } from './dto/generate-narrative.dto';
import { SuggestNarrativeDto } from './dto/suggest-narrative.dto';
import { demoSuggestion, parseSuggestion, patternContext, suggestionOutputGate, suggestionPrompt } from './narrative-parsers';
import { evaluateDraftQuality } from './draft-quality';
import { demoNarrative, narrativeRequest, resolveReferences, reviewGenerated, rewriteNarrative, storedReferences } from './narrative-generation';
import { listedNarrative, reviewNotesForNarrative } from './narrative-listing';
import { parseNarrative } from './narrative-output';
import { isNaturalnessBlocked, naturalnessInstruction } from './narrative-review';
import { personaVoiceContract } from '../personas/persona-voice';
import { narrativeShapeGate } from './narrative-output';
import { fetchReferencePreview } from './reference-preview';
import { Narrative } from './schemas/narrative.schema';

export { demoNarrative } from './narrative-generation';
export type NarrativeProgress = (stage: 'generating' | 'reviewing' | 'saved', progress: number, message: string, agent?: 'Reference Agent' | 'Knowledge Agent' | 'Narrative Agent' | 'Reviewer Agent') => void;

@Injectable()
export class NarrativesService {
  constructor(@InjectModel(Narrative.name) private readonly narratives: Model<Narrative>, private readonly personas: PersonasService, private readonly knowledge: KnowledgeService, private readonly ai: AiOrchestratorService, @Optional() private readonly threads?: ThreadsService) {}

  async generate(dto: GenerateNarrativeDto, onProgress?: NarrativeProgress) {
    const persona = await this.personas.findActive();
    if (!persona) throw new NotFoundException('Persona tidak ditemukan');
    if (dto.referenceUrl || dto.references?.length) onProgress?.('generating', 20, 'Memeriksa referensi yang diberikan.', 'Reference Agent');
    const references = await resolveReferences(dto);
    const personaId = String(persona._id);
    onProgress?.('generating', 38, 'Mengambil pola internal yang relevan.', 'Knowledge Agent');
    const retrieval = this.knowledge.findRelevantWithMeta ? await this.knowledge.findRelevantWithMeta(dto.topic, personaId) : { records: await this.knowledge.findRelevant(dto.topic, personaId), metadata: { mode: 'empty' as const, semanticCount: 0, lexicalCount: 0, knowledgeIds: [] } };
    const patterns = retrieval.records.length ? retrieval.records : await this.knowledge.findRelevant(dto.topic, personaId);
    const request = narrativeRequest(dto, persona, references, patterns.map(patternContext));
    onProgress?.('generating', 55, 'Menyusun rangkaian post dari konteks yang sudah dipilih.', 'Narrative Agent');
    const result = await this.ai.complete({ task: 'narrative', system: request.system, prompt: request.prompt, maxTokens: 1500, json: true, personaModels: true, outputGate: narrativeShapeGate, retrieval: retrieval.metadata });
    const generated = result.mode === 'demo' ? demoNarrative(dto, persona, request.primary) : parseNarrative(result.content);
    onProgress?.('reviewing', 70, 'Memeriksa konteks link, suara persona, dan risiko klaim.', 'Reviewer Agent');
    const initialNotes = reviewGenerated(generated, dto.topic, persona, references);
    const rewritten = initialNotes.length && result.mode === 'live' ? await rewriteNarrative(this.ai, generated, initialNotes, persona, references, dto.topic) : { draft: generated, rewritten: false };
    const reviewerNotes = reviewGenerated(rewritten.draft, dto.topic, persona, references);
    if (rewritten.rewritten) reviewerNotes.unshift('Quality gate menemukan kelemahan; sistem membuat ulang draft sekali.');
    const primary = references[0] ?? { description: '' };
    const saved = await this.narratives.create({ topic: dto.topic, personaId, referenceTitle: primary.title, referenceUrl: primary.url, references: storedReferences(references), ...rewritten.draft, reviewerNotes, retrieval: retrieval.metadata, quality: evaluateDraftQuality(reviewerNotes) });
    onProgress?.('saved', 90, 'Rangkaian draft sudah disimpan ke review queue.');
    return saved;
  }

  async suggest(dto: SuggestNarrativeDto) {
    const preview = await fetchReferencePreview(dto.referenceUrl);
    try {
      const persona = this.personas.findActive ? await this.personas.findActive() : null;
      const request = suggestionPrompt(preview, naturalnessInstruction, persona ? personaVoiceContract(persona) : undefined);
      const result = await this.ai.complete({ task: 'reference-suggestion', system: request.system, prompt: request.prompt, maxTokens: 500, json: true, personaModels: true, outputGate: (content) => suggestionOutputGate(content, preview) });
      return result.mode === 'demo' ? demoSuggestion(preview) : parseSuggestion(result.content, preview);
    } catch { return demoSuggestion(preview); }
  }

  findAll() { return this.narratives.find().sort({ createdAt: -1 }).limit(20).lean().then((items) => items.map(listedNarrative)); }

  async approve(id: string) {
    const current = await this.narratives.findById(id).lean();
    if (!current) throw new NotFoundException('Narrative tidak ditemukan');
    if (isNaturalnessBlocked(reviewNotesForNarrative(current))) throw new BadRequestException('Approval diblokir: regenerasi atau edit pola AI generik terlebih dahulu.');
    const narrative = await this.narratives.findByIdAndUpdate(id, { status: 'approved' }, { new: true }).lean();
    if (!narrative) throw new NotFoundException('Narrative tidak ditemukan');
    return narrative;
  }

  async publish(id: string) {
    if (!this.threads) throw new BadRequestException('Threads publishing is not configured.');
    const current = await this.narratives.findById(id).lean();
    if (!current) throw new NotFoundException('Narrative tidak ditemukan');
    if (current.status !== 'approved' || isNaturalnessBlocked(reviewNotesForNarrative(current))) throw new BadRequestException('Publish hanya tersedia untuk draft yang sudah disetujui.');
    if (current.publishedThreadId) return current;
    const published = await this.threads.publishText(current.body);
    const narrative = await this.narratives.findByIdAndUpdate(id, { publishedThreadId: published.threadId, publishedAt: new Date() }, { new: true }).lean();
    if (!narrative) throw new NotFoundException('Narrative tidak ditemukan');
    return narrative;
  }
}
