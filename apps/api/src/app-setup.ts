import { INestApplication, ValidationPipe } from '@nestjs/common';

export function configureApp(app: INestApplication) {
  app.enableCors({ origin: corsOrigins(process.env.CORS_ORIGINS ?? process.env.WEB_ORIGIN) });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
}

export function corsOrigins(value?: string) {
  return (value ?? 'http://localhost:3000').split(',').map((origin) => origin.trim()).filter(Boolean);
}
