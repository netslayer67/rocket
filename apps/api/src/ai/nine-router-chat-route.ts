import { ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiRequest } from './ai.types';

export type NineRouterChatRoute = { apiKey: string; url: string };

export function nineRouterChatRoute(config: ConfigService, request: AiRequest): NineRouterChatRoute | undefined {
  if (!request.personaModels) return undefined;

  const baseUrl = config.get<string>('NINE_ROUTER_BASE_URL')?.trim();
  const apiKey = config.get<string>('NINE_ROUTER_API_KEY')?.trim();
  if (!baseUrl && !apiKey) return undefined;
  if (!baseUrl || !apiKey) throw new ServiceUnavailableException('9Router chat requires NINE_ROUTER_BASE_URL and NINE_ROUTER_API_KEY');

  return { apiKey, url: `${baseUrl.replace(/\/+$/, '')}/chat/completions` };
}
