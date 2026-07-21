import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'node:crypto';
import { Model } from 'mongoose';
import { ThreadsConnection } from './schemas/threads-connection.schema';
import { encryptToken } from './threads-crypto';
import { isThreadsConfigured, readThreadsConfig } from './threads-config';
import { exchangeAuthorizationCode, exchangeLongLivedToken } from './threads-oauth';

const CONNECTION_KEY = 'default';
@Injectable()
export class ThreadsService {
  constructor(
    private readonly config: ConfigService,
    @InjectModel(ThreadsConnection.name) private readonly connections: Model<ThreadsConnection>,
  ) {}

  async status() {
    const connection = await this.connections.findOne({ key: CONNECTION_KEY }).lean();
    return {
      configured: isThreadsConfigured(this.config),
      connected: Boolean(connection),
      accountId: connection?.accountId,
      expiresAt: connection?.expiresAt,
    };
  }

  start() {
    const config = readThreadsConfig(this.config);
    const state = randomUUID();
    const url = new URL('https://threads.net/oauth/authorize');
    url.search = new URLSearchParams({ client_id: config.appId, redirect_uri: config.redirectUri, scope: config.scopes.join(','), response_type: 'code', state }).toString();
    return { state, url: url.toString() };
  }

  async complete(code: string | undefined, state: string | undefined, cookieState: string | undefined) {
    if (!code || !state || !this.validState(state, cookieState)) throw new BadRequestException('Threads authorization session is invalid or expired');
    const config = readThreadsConfig(this.config);
    const shortToken = await exchangeAuthorizationCode(config, code);
    const token = await exchangeLongLivedToken(config, shortToken.accessToken);
    const encrypted = encryptToken(token.accessToken, config.encryptionKey);
    const expiresAt = new Date(Date.now() + token.expiresIn * 1000);
    await this.connections.findOneAndUpdate(
      { key: CONNECTION_KEY },
      { $set: { key: CONNECTION_KEY, accountId: shortToken.userId, ...encrypted, expiresAt, connectedAt: new Date() } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  async disconnect() {
    await this.connections.deleteOne({ key: CONNECTION_KEY });
    return { disconnected: true };
  }

  private validState(state: string, cookieState: string | undefined) {
    return Boolean(cookieState && state === cookieState);
  }
}
