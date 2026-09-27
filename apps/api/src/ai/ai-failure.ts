import { AiRejection } from './ai.types';

export class ModelRequestError extends Error {
  constructor(readonly status: number) { super(`Model request failed (${status})`); }
}

export function failureCode(error: unknown): AiRejection {
  if (error instanceof Error && error.name === 'TimeoutError') return 'timeout';
  if (!(error instanceof ModelRequestError)) return 'request-error';
  if ([400, 401, 403, 404, 429].includes(error.status)) return `http-${error.status}` as AiRejection;
  return error.status >= 500 ? 'http-5xx' : 'request-error';
}
