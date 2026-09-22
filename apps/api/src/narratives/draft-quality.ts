import { diagnoseReviewNotes } from './narrative-diagnostics';

export type DraftQuality = {
  persona: number;
  specificity: number;
  stereotype: number;
  hiddenSelling: number;
  overall: number;
  passed: boolean;
  diagnostics: string[];
};

const dimensions = {
  persona: ['PERSONA_CONTEXT', 'HUMAN_VOICE'],
  specificity: ['INFORMATION_GAP', 'SCENE_CONFLICT', 'CONTEXT_DRIFT', 'TOPIC_DRIFT', 'HOOK_GENERIC'],
  stereotype: ['STEREOTYPE_RISK'],
  hiddenSelling: ['PRODUCT_INJECTION', 'PROMOTIONAL_LANGUAGE', 'REFERENCE_BRIDGE', 'EVIDENCE_PROVENANCE', 'DISCUSSION_QUALITY'],
} as const;

export function evaluateDraftQuality(notes: string[]): DraftQuality {
  const diagnostics = diagnoseReviewNotes(notes);
  const codes = diagnostics.map((item) => item.code);
  const scores = Object.fromEntries(Object.entries(dimensions).map(([name, targets]) => [name, score(targets, diagnostics)])) as Omit<DraftQuality, 'overall' | 'passed' | 'diagnostics'>;
  const overall = Math.round(Object.values(scores).reduce((total, value) => total + value, 0) / 4);
  return { ...scores, overall, passed: diagnostics.every((item) => item.severity !== 'blocking'), diagnostics: codes };
}

function score(targets: readonly string[], diagnostics: ReturnType<typeof diagnoseReviewNotes>) {
  const relevant = diagnostics.filter((item) => targets.includes(item.code));
  if (relevant.some((item) => item.severity === 'blocking')) return 0;
  return relevant.length ? 70 : 100;
}
