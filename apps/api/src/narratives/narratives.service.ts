import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AiOrchestratorService } from '../ai/ai-orchestrator.service';
import { KnowledgeService } from '../knowledge/knowledge.service';
import { Persona } from '../personas/schemas/persona.schema';
import { PersonasService } from '../personas/personas.service';
import { GenerateNarrativeDto } from './dto/generate-narrative.dto';
import { SuggestNarrativeDto } from './dto/suggest-narrative.dto';
import { isNaturalnessBlocked, naturalnessInstruction, reviewNarrative } from './narrative-review';
import { fetchReferencePreview, type ReferencePreview } from './reference-preview';
import { Narrative } from './schemas/narrative.schema';
import { ThreadsService } from '../threads/threads.service';
import { Optional } from '@nestjs/common';
import { demoSuggestion, parseSuggestion, patternContext, suggestionPrompt } from './narrative-parsers';
import { diagnoseReviewNotes } from './narrative-diagnostics';
type GeneratedNarrative = Pick<Narrative, 'title' | 'body' | 'linkPlacement'>;
type PersonaShape = Pick<Persona, 'name' | 'tone' | 'vocabulary' | 'sentenceLength' | 'emojiHabit' | 'interactionStyle'> & Partial<Pick<Persona, 'thinkingStyle' | 'observationStyle' | 'reasoningPatterns'>>;
export type NarrativeProgress = (stage: 'generating' | 'reviewing' | 'saved', progress: number, message: string) => void;

@Injectable()
export class NarrativesService {
  constructor(
    @InjectModel(Narrative.name) private readonly narratives: Model<Narrative>,
    private readonly personas: PersonasService,
    private readonly knowledge: KnowledgeService,
    private readonly ai: AiOrchestratorService,
    @Optional() private readonly threads?: ThreadsService,
  ) {}

  async generate(dto: GenerateNarrativeDto, onProgress?: NarrativeProgress) {
    onProgress?.('generating', 20, 'Mencari pola yang relevan dan menyusun narasi.');
    const persona = await this.personas.findById(dto.personaId);
    if (!persona) throw new NotFoundException('Persona tidak ditemukan');
    const reference = await this.resolveReference(dto);
    const retrieval = this.knowledge.findRelevantWithMeta
      ? await this.knowledge.findRelevantWithMeta(dto.topic)
      : { records: await this.knowledge.findRelevant(dto.topic), metadata: { mode: 'empty' as const, semanticCount: 0, lexicalCount: 0, knowledgeIds: [] } };
    const patterns = retrieval.records.length ? retrieval.records : await this.knowledge.findRelevant(dto.topic);
    const result = await this.ai.complete({
      task: 'narrative',
      system:
        `You are a narrative strategist. Write in Indonesian. A reference is context, never a sales CTA. Do not invent product claims or relationships. ${naturalnessInstruction} Return valid JSON only.`,
      prompt: `Create one compact social thread as {"title":"...","body":"...","linkPlacement":"opening|middle|ending|reply"}.

TOPIC: ${dto.topic}
REFERENCE TITLE: ${reference.title ?? 'none'}
REFERENCE DESCRIPTION: ${reference.description || 'none'}
REFERENCE METADATA: ${JSON.stringify(reference.metadata ?? {})}
REFERENCE URL: ${reference.url ?? 'none'}
PERSONA: ${JSON.stringify(persona)}
THINKING STYLE: ${persona.thinkingStyle || 'optional; infer from the scene, never imitate keywords'}
OBSERVATION STYLE: ${persona.observationStyle || 'concrete everyday details'}
REUSABLE PATTERNS: ${JSON.stringify(patterns.map(patternContext))}

Rules: the title must sound like a spoken thread opening, never a news/article headline. Start with a concrete first-person observation or another fitting human opening. Show a small uncertainty, story beat, question, or process of thought before concluding, but never force one sequence. Leave one specific tension or detail unresolved; do not force a broad closing question. Branch through real human concerns such as heat, guests, timing, discomfort, or a small worry before a reference appears; never take the shortest path from topic to product. Persona should guide the narrator's thinking, not force repeated vocabulary. Preferred shapes include Observe -> Wonder -> Hypothesis -> Reference -> Open Question, Question -> Discussion -> Reference, Experience -> Reflection -> Reference, and Fact -> Story -> Reference -> Humor; choose the one that fits. If a URL exists, mention the reference title or a distinctive part of it before the URL and explain the connection in that same thought. Never append a bare URL or write 'Referensi yang gue maksud'. If the topic and reference cannot be truthfully connected, shift to their real shared context; never use an unrelated reference. Never write marketplace listing language or unsupported garment specifications as fact. Use reference metadata only for clearly hedged inferences, never as invented firsthand experience. Never write 'klik sekarang', 'beli', 'promo', urgency claims, or an unverified person/product endorsement. Treat negative lessons or naturalness 2 or lower as diagnosed anti-patterns to avoid; treat positive lessons or naturalness 4 or higher as optional structural guidance and never copy their wording.`,
      maxTokens: 1100,
      json: true,
      retrieval: retrieval.metadata,
    });
    const generated = result.mode === 'demo' ? demoNarrative(dto, persona, reference) : parseNarrative(result.content);
    onProgress?.('reviewing', 70, 'Memeriksa suara persona, konteks, dan posisi referensi.');
    const initialNotes = reviewNarrative(generated.title, generated.body, reviewContext(dto.topic, persona, reference));
    const rewritten = result.mode === 'live' ? await this.rewriteWeakDraft(generated, initialNotes, persona, reference, dto.topic) : { draft: generated, rewritten: false };
    const reviewerNotes = reviewNarrative(rewritten.draft.title, rewritten.draft.body, reviewContext(dto.topic, persona, reference));
    if (rewritten.rewritten) reviewerNotes.unshift('Quality gate menemukan kelemahan; sistem membuat ulang draft sekali.');

    const saved = await this.narratives.create({
      topic: dto.topic,
      personaId: dto.personaId,
      referenceTitle: reference.title,
      referenceUrl: reference.url,
      ...rewritten.draft,
      reviewerNotes,
    });
    onProgress?.('saved', 90, 'Draft sudah disimpan ke review queue.');
    return saved;
  }

  async suggest(dto: SuggestNarrativeDto) {
    const preview = await fetchReferencePreview(dto.referenceUrl);
    try {
      const request = suggestionPrompt(preview, naturalnessInstruction);
      const result = await this.ai.complete({
        task: 'reference-suggestion',
        system: request.system,
        prompt: request.prompt,
        maxTokens: 500,
        json: true,
      });
      return result.mode === 'demo' ? demoSuggestion(preview) : parseSuggestion(result.content, preview);
    } catch {
      return demoSuggestion(preview);
    }
  }

  findAll() {
    return this.narratives.find().sort({ createdAt: -1 }).limit(20).lean()
      .then((narratives) => narratives.map(listedNarrative));
  }

  async approve(id: string) {
    const current = await this.narratives.findById(id).lean();
    if (!current) throw new NotFoundException('Narrative tidak ditemukan');
    if (isNaturalnessBlocked(currentReviewerNotes(current))) {
      throw new BadRequestException('Approval diblokir: regenerasi atau edit pola AI generik terlebih dahulu.');
    }
    const narrative = await this.narratives.findByIdAndUpdate(id, { status: 'approved' }, { new: true }).lean();
    if (!narrative) throw new NotFoundException('Narrative tidak ditemukan');
    return narrative;
  }

  async publish(id: string) {
    if (!this.threads) throw new BadRequestException('Threads publishing is not configured.');
    const current = await this.narratives.findById(id).lean();
    if (!current) throw new NotFoundException('Narrative tidak ditemukan');
    if (current.status !== 'approved' || isNaturalnessBlocked(currentReviewerNotes(current))) {
      throw new BadRequestException('Publish hanya tersedia untuk draft yang sudah disetujui.');
    }
    if (current.publishedThreadId) return current;
    const published = await this.threads.publishText(current.body);
    const narrative = await this.narratives.findByIdAndUpdate(id, { publishedThreadId: published.threadId, publishedAt: new Date() }, { new: true }).lean();
    if (!narrative) throw new NotFoundException('Narrative tidak ditemukan');
    return narrative;
  }

  private async rewriteWeakDraft(draft: GeneratedNarrative, notes: string[], persona: PersonaShape, reference: ReferenceContext, topic: string) {
    if (!isNaturalnessBlocked(notes)) return { draft, rewritten: false };
    try {
      const result = await this.ai.complete({
        task: 'narrative',
        system: `Rewrite an Indonesian social thread. ${naturalnessInstruction} Preserve only factual claims and return valid JSON only.`,
        prompt: `Rewrite this draft as {"title":"...","body":"...","linkPlacement":"opening|middle|ending|reply"}.

PERSONA: ${JSON.stringify(persona)}
THINKING STYLE: ${persona.thinkingStyle || 'optional'}
OBSERVATION STYLE: ${persona.observationStyle || 'concrete everyday details'}
TOPIC: ${topic}
REFERENCE TITLE: ${reference.title ?? 'none'}
REFERENCE URL: ${reference.url ?? 'none'}
REVIEWER FAILURES: ${JSON.stringify(notes)}
DRAFT: ${JSON.stringify(draft)}

Fix every reviewer failure. Keep the persona's reasoning and a concrete information gap. Preserve the draft's fitting structure instead of forcing a template. Keep every activity, object, and environment in one believable scene unless an explicit comparison bridge is present. Replace abstract metaphors and generic adjectives with a specific sensory observation. Make the title conversational, not journalistic. Follow at least one real concern before introducing the reference; remove shopping transitions, marketplace descriptions, unsupported garment specifications, persona keyword cosplay, unsupported community conclusions, and product-led closing questions. If there is a URL, name its reference context before the URL and make the connection explicit.`,
        maxTokens: 900,
        json: true,
      });
      return result.mode === 'live' ? { draft: parseNarrative(result.content), rewritten: true } : { draft, rewritten: false };
    } catch {
      return { draft, rewritten: false };
    }
  }

  private async resolveReference(dto: GenerateNarrativeDto): Promise<ReferenceContext> {
    const fallback = { title: dto.referenceTitle, url: dto.referenceUrl, description: '' };
    if (!dto.referenceUrl) return fallback;
    try {
      const preview = await fetchReferencePreview(dto.referenceUrl);
      return { title: preview.title, url: dto.referenceUrl, description: preview.description, metadata: preview };
    } catch {
      return fallback;
    }
  }
}

function parseNarrative(content: string): GeneratedNarrative {
  const clean = content.replace(/^```(?:json)?\s*|\s*```$/g, '');
  const value = JSON.parse(clean) as Partial<GeneratedNarrative>;
  if (!value.title || !value.body || !value.linkPlacement) throw new Error('Narrative response is incomplete');
  return {
    title: String(value.title).slice(0, 180),
    body: String(value.body).slice(0, 5000),
    linkPlacement: String(value.linkPlacement).slice(0, 30),
  };
}
type ReferenceContext = { title?: string; url?: string; description: string; metadata?: ReferencePreview };

function reviewContext(topic: string, persona: PersonaShape, reference: ReferenceContext) {
  return { topic, vocabulary: persona.vocabulary, referenceTitle: reference.title, referenceUrl: reference.url, evidence: reference.description ? [{ source: 'reference-metadata' as const, text: reference.description }] : [] };
}

function currentReviewerNotes(narrative: Pick<Narrative, 'topic' | 'title' | 'body' | 'referenceTitle' | 'referenceUrl' | 'reviewerNotes'>) {
  return [...new Set([...(narrative.reviewerNotes ?? []), ...reviewNarrative(narrative.title, narrative.body, {
    topic: narrative.topic,
    referenceTitle: narrative.referenceTitle,
    referenceUrl: narrative.referenceUrl,
  })])];
}

function listedNarrative(narrative: Pick<Narrative, 'topic' | 'title' | 'body' | 'referenceTitle' | 'referenceUrl' | 'reviewerNotes'>) { const reviewerNotes = currentReviewerNotes(narrative); return { ...narrative, reviewerNotes, reviewerDiagnostics: diagnoseReviewNotes(reviewerNotes) }; }

export function demoNarrative(dto: GenerateNarrativeDto, persona: PersonaShape, reference: ReferenceContext = { title: dto.referenceTitle, url: dto.referenceUrl, description: '' }): GeneratedNarrative {
  const narrator = persona.vocabulary.find((word) => /^(gue|gw|aku|saya)$/i.test(word)) ?? 'aku';
  const link = reference.title ? `\n\n${narrator} kepikiran itu pas lihat ${reference.title}.${reference.url ? ` Bagian itu yang bikin sudut ini terasa nyambung: ${reference.url}` : ''}` : '';
  return {
    title: `${narrator} baru kepikiran satu sisi dari ${dto.topic}`,
    body: `${narrator} baru kepikiran ${dto.topic} dari detail yang kelihatannya kecil. Ada bagian yang bikin ${narrator} belum sepakat sama cara orang biasanya membahasnya.\n\nYang pengin ${narrator} gali justru alasan di balik detail itu, karena dari situ obrolannya bisa jadi lebih jujur.${link}`,
    linkPlacement: 'ending',
  };
}
