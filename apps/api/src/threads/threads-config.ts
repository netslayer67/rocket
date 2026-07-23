import { ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type ThreadsConfig = {
  appId: string;
  appSecret: string;
  redirectUri: string;
  scopes: string[];
  encryptionKey: Buffer;
};

export function readThreadsConfig(config: ConfigService): ThreadsConfig {
  const appId = required(config, 'THREADS_APP_ID');
  const appSecret = required(config, 'THREADS_APP_SECRET');
  const redirectUri = required(config, 'THREADS_REDIRECT_URI');
  const encryptionKey = Buffer.from(required(config, 'THREADS_TOKEN_ENCRYPTION_KEY'), 'base64');
  if (encryptionKey.length !== 32) throw new ServiceUnavailableException('THREADS_TOKEN_ENCRYPTION_KEY must be a base64 32-byte key');
  const scopes = (config.get<string>('THREADS_OAUTH_SCOPES', 'threads_basic,threads_content_publish') ?? 'threads_basic,threads_content_publish').split(',').map((scope) => scope.trim()).filter(Boolean);
  return { appId, appSecret, redirectUri, scopes, encryptionKey };
}

export function isThreadsConfigured(config: ConfigService) {
  try {
    readThreadsConfig(config);
    return true;
  } catch {
    return false;
  }
}

function required(config: ConfigService, key: string) {
  const value = config.get<string>(key)?.trim();
  if (!value) throw new ServiceUnavailableException(`${key} is required for Threads OAuth`);
  return value;
}
