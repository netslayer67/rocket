import { ConfigService } from '@nestjs/config';
import { ThreadsService } from './threads.service';
import { oauthCookiePath, ThreadsController } from './threads.controller';

describe('ThreadsController', () => {
  it('returns a public success response when Meta checks the callback URL', async () => {
    const response = {
      status: jest.fn(), send: jest.fn(), redirect: jest.fn(), setHeader: jest.fn(),
    };
    response.status.mockReturnValue(response);
    const controller = new ThreadsController({ complete: jest.fn() } as unknown as ThreadsService, { get: jest.fn() } as unknown as ConfigService);

    await controller.callback(undefined, undefined, undefined, { headers: {} }, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.send).toHaveBeenCalledWith('Threads OAuth callback is ready.');
  });

  it.each([
    ['http://localhost:4000/threads/callback', '/threads'],
    ['https://rocket-api-hazel.vercel.app/api/threads/callback', '/api/threads'],
  ])('derives the browser cookie path from %s', (redirectUri, expected) => {
    expect(oauthCookiePath(redirectUri)).toBe(expected);
  });

  it('trims whitespace from the dashboard redirect after callback failure', async () => {
    const response = {
      status: jest.fn(), send: jest.fn(), redirect: jest.fn(), setHeader: jest.fn(),
    };
    const threads = { complete: jest.fn().mockRejectedValue(new Error('exchange failed')) };
    const config = { get: jest.fn((key: string, fallback: string) => key === 'WEB_ORIGIN' ? ' https://rocket-web-five.vercel.app/ \n' : fallback) };
    const controller = new ThreadsController(threads as unknown as ThreadsService, config as unknown as ConfigService);

    await controller.callback('code', 'state', undefined, { headers: {} }, response);

    expect(response.redirect).toHaveBeenCalledWith('https://rocket-web-five.vercel.app?threads=error');
  });
});
