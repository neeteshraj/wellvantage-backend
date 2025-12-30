/**
 * @fileoverview Root application module for the NestJS application.
 * @module app-module
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { HealthModule } from './modules/health/health.module';

/**
 * Root module of the NestJS application.
 * Configures global settings and imports all feature modules.
 *
 * Configuration:
 * - ConfigModule: Loads environment variables from .env file
 * - DatabaseModule: Configures TypeORM with PostgreSQL
 * - CalendarModule: Calendar/Availability/Booking feature
 *
 * @example
 * ```typescript
 * // In main.ts
 * const app = await NestFactory.create(AppModule);
 * ```
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    CalendarModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppModule {}
