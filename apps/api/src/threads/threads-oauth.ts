import { ThreadsConfig } from './threads-config';

type TokenResponse = { access_token?: string; user_id?: string; expires_in?: number };
export type AuthorizationToken = { accessToken: string; userId: string };
export type LongLivedToken = { accessToken: string; expiresIn: number };

export async function exchangeAuthorizationCode(config: ThreadsConfig, code: string) {
  const body = new URLSearchParams({ client_id: config.appId, client_secret: config.appSecret, code, grant_type: 'authorization_code', redirect_uri: config.redirectUri });
  const response = await requestToken('https://graph.threads.net/oauth/access_token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
  if (!response.access_token || !response.user_id) throw new Error('Threads authorization response was incomplete');
  return { accessToken: response.access_token, userId: response.user_id } satisfies AuthorizationToken;
}

export async function exchangeLongLivedToken(config: ThreadsConfig, accessToken: string) {
  const url = new URL('https://graph.threads.net/access_token');
  url.search = new URLSearchParams({ grant_type: 'th_exchange_token', client_secret: config.appSecret, access_token: accessToken }).toString();
  const response = await requestToken(url.toString());
  const expiresIn = Number(response.expires_in);
  if (!response.access_token || !Number.isFinite(expiresIn)) throw new Error('Threads long-lived token response was incomplete');
  return { accessToken: response.access_token, expiresIn } satisfies LongLivedToken;
}

async function requestToken(url: string, init?: RequestInit): Promise<TokenResponse> {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`Threads token exchange failed: ${await errorDetail(response)}`);
  const body = await response.json() as TokenResponse;
  return body;
}

async function errorDetail(response: Response) {
  try {
    const body = await response.json() as { error_message?: string; error_type?: string; error?: { message?: string } };
    return String(body.error_message ?? body.error?.message ?? body.error_type ?? 'Meta rejected the request').slice(0, 180);
  } catch {
    return 'Meta rejected the request';
  }
}
