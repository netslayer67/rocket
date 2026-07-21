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
});
