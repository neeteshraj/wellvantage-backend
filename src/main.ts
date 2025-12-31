/**
 * @fileoverview Application bootstrap and entry point.
 * @module main
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/** Logger instance for bootstrap messages */
const logger = new Logger('Bootstrap');

/**
 * Bootstraps the NestJS application with global configuration.
 *
 * Configuration applied:
 * - Global ValidationPipe for automatic DTO validation
 * - CORS enabled for frontend integration
 * - Whitelist mode strips unknown properties from requests
 * - Transform mode auto-converts payloads to DTO instances
 *
 * Environment Variables:
 * - PORT: Server port (default: 3000)
 * - CORS_ORIGIN: Allowed CORS origin (default: '*')
 *
 * @returns Promise that resolves when the application is listening
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  const port = process.env.PORT ?? '3000';
  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Calendar API available at: http://localhost:${port}/calendar`);
  logger.log(`Workout API available at: http://localhost:${port}/workout`);
}

void bootstrap();
