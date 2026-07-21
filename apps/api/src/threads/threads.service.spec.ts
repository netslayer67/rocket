import { BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { ThreadsConnection } from './schemas/threads-connection.schema';
import { ThreadsService } from './threads.service';

describe('ThreadsService', () => {
  it('does not start OAuth when required configuration is absent', () => {
    const service = new ThreadsService(config({ THREADS_APP_ID: '' }), model());
    expect(() => service.start()).toThrow(ServiceUnavailableException);
  });

  it('rejects an OAuth callback that is not bound to the initiating browser', async () => {
    const service = new ThreadsService(config(), model());
    const { state } = service.start();
    await expect(service.complete('code', state, 'different-state')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('reports connection status without encrypted token fields', async () => {
    const service = new ThreadsService(config(), model({ accountId: 'thread-user', expiresAt: new Date('2030-01-01') }));
    await expect(service.status()).resolves.toEqual({ configured: true, connected: true, accountId: 'thread-user', expiresAt: new Date('2030-01-01') });
  });
});

function config(values: Record<string, string> = {}) {
  const defaults = {
    THREADS_APP_ID: 'app-id',
    THREADS_APP_SECRET: 'app-secret',
    THREADS_REDIRECT_URI: 'http://localhost:4000/threads/callback',
    THREADS_OAUTH_SCOPES: 'threads_basic',
    THREADS_TOKEN_ENCRYPTION_KEY: Buffer.alloc(32, 1).toString('base64'),
  };
  return { get: (key: string, fallback?: string) => values[key] ?? defaults[key as keyof typeof defaults] ?? fallback } as ConfigService;
}

function model(record?: { accountId: string; expiresAt: Date }) {
  return {
    findOne: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(record) }),
  } as unknown as Model<ThreadsConnection>;
}
