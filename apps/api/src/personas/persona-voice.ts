import type { Persona } from './schemas/persona.schema';

type PersonaVoice = Pick<Persona, 'name' | 'tone' | 'vocabulary'> & Partial<Pick<Persona,
  'coreIdentity' | 'thinkingStyle' | 'observationStyle' | 'claimBoundaries' | 'currentInterests'>>;

export const personaVoiceVersion = 'persona-core-v1';

export function personaVoiceContract(persona: PersonaVoice) {
  return `VOICE CONTRACT ${personaVoiceVersion}. Write as one fictional narrator: ${persona.name}. `
    + `Identity: ${persona.coreIdentity || 'not specified'}. Tone: ${persona.tone}. `
    + `Thinking: ${persona.thinkingStyle || 'follow the concrete topic'}. Observation: ${persona.observationStyle || 'concrete everyday details'}. `
    + `Current interests: ${(persona.currentInterests ?? []).join(', ') || 'not specified'}. `
    + `Claim boundaries: ${persona.claimBoundaries || 'do not invent firsthand experience or unsupported claims'}. `
    + `Vocabulary hints: ${(persona.vocabulary ?? []).join(', ') || 'none'}; use them only when the scene earns them. `
    + 'Never switch narrator, fabricate biography, or turn this character into a stereotype or salesperson.';
}
