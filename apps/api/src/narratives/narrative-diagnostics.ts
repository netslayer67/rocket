export type NarrativeDiagnostic = {
  code: string;
  dimension: 'reference' | 'scene' | 'persona' | 'evidence' | 'topic' | 'reasoning' | 'language' | 'discussion' | 'narrative';
  severity: 'blocking' | 'warning';
  message: string;
};

const mappings: Array<[string, NarrativeDiagnostic['code'], NarrativeDiagnostic['dimension']]> = [
  ['Product Injection Score', 'PRODUCT_INJECTION', 'reference'],
  ['jembatan konteks', 'REFERENCE_BRIDGE', 'reference'],
  ['Diagnosis persona', 'PERSONA_CONTEXT', 'persona'],
  ['Diagnosis evidence', 'EVIDENCE_PROVENANCE', 'evidence'],
  ['Detail adegan tidak koheren', 'SCENE_CONFLICT', 'scene'],
  ['Context drift', 'CONTEXT_DRIFT', 'scene'],
  ['Topic drift', 'TOPIC_DRIFT', 'topic'],
  ['Reasoning flow', 'REASONING_FLOW', 'reasoning'],
  ['Information gap', 'INFORMATION_GAP', 'narrative'],
  ['Human voice', 'HUMAN_VOICE', 'persona'],
  ['Kualitas diskusi', 'DISCUSSION_QUALITY', 'discussion'],
  ['AI generic', 'AI_GENERIC', 'language'],
  ['Hook terasa', 'HOOK_GENERIC', 'narrative'],
];

export function diagnoseReviewNotes(notes: string[]): NarrativeDiagnostic[] {
  const seen = new Set<string>();
  return notes.map((message) => {
    const match = mappings.find(([needle]) => message.includes(needle));
    const code = match?.[1] ?? 'OTHER_REVIEW_NOTE';
    if (seen.has(code)) return undefined;
    seen.add(code);
    return { code, dimension: match?.[2] ?? 'narrative', severity: message.startsWith('Review blocked:') ? 'blocking' : 'warning', message };
  }).filter(Boolean) as NarrativeDiagnostic[];
}
