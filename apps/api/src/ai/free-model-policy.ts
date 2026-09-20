export const freeProvider = { max_price: { prompt: 0, completion: 0, request: 0 } };

const approvedLearningModels = [
  'nvidia/nemotron-3-super-120b-a12b:free',
  'nex-agi/nex-n2.5-mini:free',
  'nex-agi/nex-n2.5-pro:free',
] as const;

export function learningModels(configured?: string) {
  const requested = (configured || approvedLearningModels.join(',')).split(',').map((model) => model.trim());
  return [...new Set(requested)].filter((model): model is (typeof approvedLearningModels)[number] =>
    (approvedLearningModels as readonly string[]).includes(model),
  ).slice(0, 3);
}

export function freeLearningRouting(model: string) {
  // ponytail: keep this small allowlist until a candidate passes the same structured-output contract test.
  return {
    provider: freeProvider,
    reasoning: { effort: model.startsWith('nvidia/') ? 'low' : 'none', exclude: true },
  };
}

export function isFreeModel(model: string) {
  return model.endsWith(':free') || model === 'openrouter/free';
}
