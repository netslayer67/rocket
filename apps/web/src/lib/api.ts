import type { Narrative, NarrativeInput, NarrativeJobEvent } from './types';

export const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

type ErrorBody = { message?: string | string[] };

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  const body = (await response.json()) as T & ErrorBody;
  if (!response.ok) throw new Error(errorMessage(body.message));
  return body;
}

export async function startNarrativeJob(input: NarrativeInput) {
  return api<{ jobId: string }>('/narratives/generate', { method: 'POST', body: JSON.stringify(input) });
}

export function watchNarrativeJob(jobId: string, onProgress: (event: NarrativeJobEvent) => void) {
  return new Promise<Narrative>((resolve, reject) => {
    const source = new EventSource(`${apiUrl}/narratives/events?jobId=${encodeURIComponent(jobId)}`);
    const eventTypes = ['queued', 'generating', 'reviewing', 'saved', 'complete', 'error'];
    let settled = false;
    const finish = (error?: Error, narrative?: Narrative) => {
      if (settled) return;
      settled = true;
      source.close();
      error ? reject(error) : resolve(narrative as Narrative);
    };
    const handle = (event: Event) => {
      try {
        const value = JSON.parse((event as MessageEvent<string>).data) as NarrativeJobEvent;
        onProgress(value);
        if (value.stage === 'complete' && value.narrative) finish(undefined, value.narrative);
        if (value.stage === 'error') finish(new Error(value.error || value.message));
      } catch {
        finish(new Error('Respons progress narasi tidak valid.'));
      }
    };
    eventTypes.forEach((type) => source.addEventListener(type, handle));
    source.onerror = () => finish(new Error('Sambungan progress narasi terputus.'));
  });
}

function errorMessage(message: ErrorBody['message']) {
  return Array.isArray(message) ? message.join(', ') : message ?? 'Request gagal.';
}
