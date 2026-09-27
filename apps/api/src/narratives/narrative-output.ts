import type { AiGateResult } from '../ai/ai.types';
import type { Persona } from '../personas/schemas/persona.schema';
import { evaluateDraftQuality } from './draft-quality';
import { reviewNarrative } from './narrative-review';
import type { ReferencePreview } from './reference-preview';
import type { Narrative } from './schemas/narrative.schema';
import { parseSequence, type ContentSequence } from './narrative-sequence';
import { parseModelJsonObject } from './model-json';

export type GeneratedNarrative = Pick<Narrative, 'title' | 'body' | 'linkPlacement'> & { sequence: ContentSequence };
export type NarrativePersona = Pick<Persona, 'name' | 'tone' | 'vocabulary' | 'sentenceLength' | 'emojiHabit' | 'interactionStyle'>
  & Partial<Pick<Persona, 'thinkingStyle' | 'observationStyle' | 'reasoningPatterns' | 'coreIdentity' | 'claimBoundaries' | 'currentInterests'>>;
export type ReferenceContext = { title?: string; url?: string; description: string; metadata?: ReferencePreview };

export function parseNarrative(content: string): GeneratedNarrative {
  const value = parseModelJsonObject(content) as Partial<GeneratedNarrative>;
  if (!value.title || !value.body || !value.linkPlacement) throw new Error('Narrative response is incomplete');
  const fallbackBody = String(value.body).slice(0, 5000);
  const sequence = parseSequence(value.sequence, fallbackBody);
  return { title: String(value.title).slice(0, 180), body: sequence.posts[0].body, linkPlacement: String(value.linkPlacement).slice(0, 30), sequence };
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

export function narrativeShapeGate(content: string): AiGateResult {
  try {
    parseNarrative(content);
    return 'accepted';
  } catch {
    return 'invalid-output';
  }
}
