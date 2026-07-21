import { ConfigService } from '@nestjs/config';
import { ThreadsService } from './threads.service';
import { ThreadsController } from './threads.controller';

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
});
