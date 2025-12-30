/**
 * @fileoverview NestJS module for database configuration.
 * @module database/database-module
 */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';

/**
 * NestJS module that configures TypeORM for database access.
 * Uses async configuration to properly integrate with NestJS dependency injection.
 *
 * Features:
 * - Imports data source options from centralized configuration
 * - Enables autoLoadEntities for automatic entity discovery
 * - Integrates with ConfigModule for environment variable access
 *
 * @example
 * ```typescript
 * // Import in AppModule
 * import { DatabaseModule } from './database/database.module';
 *
 * @Module({
 *   imports: [DatabaseModule],
 * })
 * export class AppModule {}
 * ```
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        ...dataSourceOptions,
        autoLoadEntities: true,
      }),
    }),
  ],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class DatabaseModule {}
