import type { AiGateResult } from '../ai/ai.types';
import type { Persona } from '../personas/schemas/persona.schema';
import { evaluateDraftQuality } from './draft-quality';
import { reviewNarrative } from './narrative-review';
import type { ReferencePreview } from './reference-preview';
import type { Narrative } from './schemas/narrative.schema';

export type GeneratedNarrative = Pick<Narrative, 'title' | 'body' | 'linkPlacement'>;
export type NarrativePersona = Pick<Persona, 'name' | 'tone' | 'vocabulary' | 'sentenceLength' | 'emojiHabit' | 'interactionStyle'>
  & Partial<Pick<Persona, 'thinkingStyle' | 'observationStyle' | 'reasoningPatterns' | 'coreIdentity' | 'claimBoundaries' | 'currentInterests'>>;
export type ReferenceContext = { title?: string; url?: string; description: string; metadata?: ReferencePreview };

export function parseNarrative(content: string): GeneratedNarrative {
  const value = JSON.parse(content.replace(/^```(?:json)?\s*|\s*```$/g, '')) as Partial<GeneratedNarrative>;
  if (!value.title || !value.body || !value.linkPlacement) throw new Error('Narrative response is incomplete');
  return { title: String(value.title).slice(0, 180), body: String(value.body).slice(0, 5000), linkPlacement: String(value.linkPlacement).slice(0, 30) };
}

export function reviewContext(topic: string, persona: NarrativePersona, reference: ReferenceContext) {
  return { topic, vocabulary: persona.vocabulary, referenceTitle: reference.title, referenceUrl: reference.url,
    evidence: reference.description ? [{ source: 'reference-metadata' as const, text: reference.description }] : [] };
}

export function narrativeOutputGate(content: string, topic: string, persona: NarrativePersona, reference: ReferenceContext): AiGateResult {
  try {
    const draft = parseNarrative(content);
    return evaluateDraftQuality(reviewNarrative(draft.title, draft.body, reviewContext(topic, persona, reference))).passed ? 'accepted' : 'voice-quality';
  } catch {
    return 'invalid-output';
  }
}
