import { NestFactory } from '@nestjs/core';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app-setup';

type RequestHandler = (request: IncomingMessage, response: ServerResponse) => void;

let appHandler: Promise<RequestHandler> | undefined;

export default async function handler(request: IncomingMessage, response: ServerResponse) {
  request.url = request.url?.replace(/^\/api(?=\/|$)/, '') || '/';
  (await getAppHandler())(request, response);
}

function getAppHandler() {
  appHandler ??= NestFactory.create(AppModule).then(async (app) => {
    configureApp(app);
    await app.init();
    return app.getHttpAdapter().getInstance() as RequestHandler;
  });
  return appHandler;
}
