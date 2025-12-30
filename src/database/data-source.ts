/**
 * @fileoverview TypeORM data source configuration for database connection.
 * @module database/data-source
 */

import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

config();

/**
 * TypeORM data source configuration options.
 * Used by both the NestJS TypeORM module and CLI migration commands.
 *
 * Configuration:
 * - Database: PostgreSQL via DATABASE_URL environment variable
 * - Entities: Auto-discovered from *.orm-entity.ts files
 * - Migrations: Located in database/migrations directory
 * - Synchronize: Disabled to enforce migration-based schema changes
 * - SSL: Enabled with rejectUnauthorized=false for cloud database compatibility
 *
 * Environment Variables:
 * - DATABASE_URL: PostgreSQL connection string
 * - NODE_ENV: Enables query logging in development mode
 */
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/../**/*.orm-entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  ssl: { rejectUnauthorized: false },
};

/**
 * TypeORM DataSource instance for CLI operations.
 * Used by TypeORM CLI for running migrations.
 *
 * @example
 * ```bash
 * # Generate a new migration
 * npm run migration:generate -- src/database/migrations/MigrationName
 *
 * # Run pending migrations
 * npm run migration:run
 * ```
 */
const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
