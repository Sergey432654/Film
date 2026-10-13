import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module.js';
import { createValidationPipe } from './common/validation.pipe.js';
import { appConfig, type AppConfig } from './config/app.config.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<AppConfig>(appConfig.KEY);

  app.setGlobalPrefix('api');
  app.enableCors({ origin: config.clientUrl });
  app.useGlobalPipes(createValidationPipe());
  app.enableShutdownHooks();

  await app.listen(config.port);
}
await bootstrap();
