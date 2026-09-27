import type { AiOrchestratorService } from '../ai/ai-orchestrator.service';
import { personaVoiceContract } from '../personas/persona-voice';
import { naturalnessInstruction, reviewNarrative } from './narrative-review';
import { narrativeShapeGate, parseNarrative, reviewContext, type GeneratedNarrative, type NarrativePersona, type ReferenceContext } from './narrative-output';
import { legacySequence, sequenceText, suppliedReferences, type NarrativeReference } from './narrative-sequence';
import { reviewSequence } from './sequence-review';
import { fetchReferencePreview } from './reference-preview';
import type { GenerateNarrativeDto } from './dto/generate-narrative.dto';

export async function resolveReferences(dto: GenerateNarrativeDto): Promise<ReferenceContext[]> {
  const supplied = suppliedReferences(dto);
  if (!supplied.length) return [{ title: dto.referenceTitle, url: dto.referenceUrl, description: '' }];
  return Promise.all(supplied.map(async (reference) => {
    try {
      const metadata = await fetchReferencePreview(reference.url);
      return { title: metadata.title || reference.title, url: reference.url, description: metadata.description, metadata };
    } catch { return { title: reference.title, url: reference.url, description: '' }; }
  }));
}

export function storedReferences(references: ReferenceContext[]): NarrativeReference[] {
  return references.filter((reference): reference is ReferenceContext & { url: string } => Boolean(reference.url)).map(({ title, url }) => ({ title, url }));
}

export function narrativeRequest(dto: GenerateNarrativeDto, persona: NarrativePersona, references: ReferenceContext[], patterns: unknown[]) {
  const primary = references[0] ?? { description: '' };
  return {
    system: `You are a narrative strategist. Write in Indonesian. A reference is context, never a sales CTA. Do not invent product claims or relationships. ${naturalnessInstruction} Return valid JSON only.`,
    prompt: `Create a compact Threads-shaped sequence as {"title":"...","body":"...","linkPlacement":"opening|middle|ending|reply","sequence":{"archetype":"...","posts":[{"role":"main|reply","objective":"attention|utility|consideration|commerce|engagement","body":"...","links":[{"url":"...","intent":"resource|identifier|recommendation|reference|alternative|action|answer","anchor":"...","productRole":"supporting|hero"}]}],"mediaBrief":{"role":"result-context|product-identification|use-case","note":"..."}}}.

TOPIC: ${dto.topic}
REFERENCE TITLE: ${primary.title ?? 'none'}
REFERENCE DESCRIPTION: ${primary.description || 'none'}
REFERENCE METADATA: ${JSON.stringify(primary.metadata ?? {})}
REFERENCE URL: ${primary.url ?? 'none'}
REFERENCES: ${JSON.stringify(references.map(({ title, url, description, metadata }) => ({ title, url, description, metadata })))}
${personaVoiceContract(persona)}
REUSABLE PATTERNS: ${JSON.stringify(patterns)}

Rules: title and body describe the main post. Sequence has one main post and at most three replies; choose an archetype that fits, never force one. Main post earns attention through a real observation, tension, discovery, or question. Replies may deliver utility, consideration, contextual links, or engagement. Links can appear only from REFERENCES, must appear in the same post immediately after a meaningful anchor, and must declare why a reader needs them. Do not use bare URLs, repeated buy CTAs, invented scarcity, product listing language, unsupported claims, or unverified endorsements. Use one or two hero products only when supplied evidence gives a truthful reason; other references are supporting. A media brief is only a request for a creator-supplied asset, never proof by itself. High-risk health, safety, legal, or reputation allegations are out of scope. Treat negative lessons or naturalness 2 or lower as diagnosed anti-patterns to avoid; treat positive lessons or naturalness 4 or higher as optional structural guidance and never copy their wording. ${naturalnessInstruction}`,
    primary,
  };
}

export function reviewGenerated(draft: GeneratedNarrative, topic: string, persona: NarrativePersona, references: ReferenceContext[]) {
  const primary = references[0] ?? { description: '' };
  return [...new Set([...reviewNarrative(draft.title, sequenceText(draft.sequence), reviewContext(topic, persona, primary)), ...reviewSequence(draft.sequence, storedReferences(references))])];
}

export async function rewriteNarrative(ai: AiOrchestratorService, draft: GeneratedNarrative, notes: string[], persona: NarrativePersona, references: ReferenceContext[], topic: string) {
  try {
    const result = await ai.complete({
      task: 'narrative', system: `Rewrite an Indonesian Threads sequence. ${naturalnessInstruction} Preserve only factual claims and return valid JSON only.`,
      prompt: `Rewrite this draft using the same JSON shape. Fix every reviewer failure without making the reference the destination. Preserve a fitting structure, contextual supplied URLs, and only creator-supplied media briefs. No hard CTA, urgency, marketplace wording, unverified scarcity, or high-risk allegation.\n\n${personaVoiceContract(persona)}\nTOPIC: ${topic}\nREFERENCES: ${JSON.stringify(references.map(({ title, url, description }) => ({ title, url, description })))}\nREVIEWER FAILURES: ${JSON.stringify(notes)}\nDRAFT: ${JSON.stringify(draft)}`,
      maxTokens: 1100, json: true, personaModels: true, outputGate: narrativeShapeGate,
    });
    return result.mode === 'live' ? { draft: parseNarrative(result.content), rewritten: true } : { draft, rewritten: false };
  } catch { return { draft, rewritten: false }; }
}

export function demoNarrative(dto: GenerateNarrativeDto, persona: NarrativePersona, reference: ReferenceContext = { title: dto.referenceTitle, url: dto.referenceUrl, description: '' }): GeneratedNarrative {
  const narrator = persona.vocabulary.find((word) => /^(gue|gw|aku|saya)$/i.test(word)) ?? 'aku';
  const link = reference.title ? `\n\n${narrator} kepikiran itu pas lihat ${reference.title}.${reference.url ? ` Bagian itu yang bikin sudut ini terasa nyambung: ${reference.url}` : ''}` : '';
  const body = `${narrator} baru kepikiran ${dto.topic} dari detail yang kelihatannya kecil. Ada bagian yang bikin ${narrator} belum sepakat sama cara orang biasanya membahasnya.\n\nYang pengin ${narrator} gali justru alasan di balik detail itu, karena dari situ obrolannya bisa jadi lebih jujur.${link}`;
  return { title: `${narrator} baru kepikiran satu sisi dari ${dto.topic}`, body, linkPlacement: 'ending', sequence: legacySequence(body) };
}
