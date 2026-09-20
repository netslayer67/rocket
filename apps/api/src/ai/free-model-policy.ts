export const freeProvider = { max_price: { prompt: 0, completion: 0, request: 0 } };

export function isFreeModel(model: string) {
  return model.endsWith(':free') || model === 'openrouter/free';
}
