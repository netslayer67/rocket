import { Controller, Delete, Get, Logger, Query, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThreadsService } from './threads.service';

type CallbackRequest = { headers: { cookie?: string } };
type CallbackResponse = { redirect: (url: string) => void; setHeader: (name: string, value: string) => void; status: (code: number) => CallbackResponse; send: (body: string) => void };

@Controller('threads')
export class ThreadsController {
  private readonly logger = new Logger(ThreadsController.name);

  constructor(private readonly threads: ThreadsService, private readonly config: ConfigService) {}

  @Get('status')
  status() {
    return this.threads.status();
  }

  @Get('connect')
  connect(@Res() response: CallbackResponse) {
    const { state, url } = this.threads.start();
    response.setHeader('Set-Cookie', stateCookie(state, this.secureCookie, this.cookiePath));
    response.redirect(url);
  }

  @Get('callback')
  async callback(
    @Query('code') code: string | undefined,
    @Query('state') state: string | undefined,
    @Query('error') error: string | undefined,
    @Req() request: CallbackRequest,
    @Res() response: CallbackResponse,
  ) {
    if (!code && !state && !error) return response.status(200).send('Threads OAuth callback is ready.');
    try {
      await this.threads.complete(code, state, cookieValue(request.headers.cookie, 'threads_oauth_state'));
      response.setHeader('Set-Cookie', clearStateCookie(this.secureCookie, this.cookiePath));
      response.redirect(this.dashboardUrl('connected'));
    } catch (error) {
      this.logger.error(`Threads OAuth callback failed: ${safeError(error)}`);
      response.setHeader('Set-Cookie', clearStateCookie(this.secureCookie, this.cookiePath));
      response.redirect(this.dashboardUrl('error'));
    }
  }

  @Delete('connection')
  disconnect() {
    return this.threads.disconnect();
  }

  private dashboardUrl(result: 'connected' | 'error') {
    const origin = this.config.get<string>('WEB_ORIGIN', 'http://localhost:3000')?.trim().replace(/\/$/, '');
    return `${origin}?threads=${result}`;
  }

  private get secureCookie() {
    return this.config.get<string>('THREADS_REDIRECT_URI', '').startsWith('https://') ? '; Secure' : '';
  }

  private get cookiePath() {
    return oauthCookiePath(this.config.get<string>('THREADS_REDIRECT_URI', ''));
  }
}

function safeError(error: unknown) {
  return (error instanceof Error ? error.message : String(error)).slice(0, 240).replace(/[\r\n]/gu, ' ');
}

function cookieValue(cookieHeader: string | undefined, name: string) {
  return cookieHeader?.split(';').map((value) => value.trim()).find((value) => value.startsWith(`${name}=`))?.slice(name.length + 1);
}

function stateCookie(state: string, secure: string, path: string) {
  return `threads_oauth_state=${state}; HttpOnly; Path=${path}; SameSite=Lax; Max-Age=600${secure}`;
}

function clearStateCookie(secure: string, path: string) {
  return `threads_oauth_state=; HttpOnly; Path=${path}; SameSite=Lax; Max-Age=0${secure}`;
}

export function oauthCookiePath(redirectUri: string) {
  try {
    const pathname = new URL(redirectUri).pathname.replace(/\/+$/, '');
    return pathname.replace(/\/[^/]+$/, '') || '/';
  } catch {
    return '/threads';
  }
}
