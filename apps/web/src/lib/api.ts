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

function errorMessage(message: ErrorBody['message']) {
  return Array.isArray(message) ? message.join(', ') : message ?? 'Request gagal.';
}
