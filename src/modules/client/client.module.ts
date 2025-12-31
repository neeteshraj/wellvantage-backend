/**
 * @fileoverview NestJS module for client management functionality.
 * @module client/client-module
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CreateClientUseCase } from './application/usecases/create-client.usecase';
import { DeleteClientUseCase } from './application/usecases/delete-client.usecase';
import { GetClientsUseCase } from './application/usecases/get-clients.usecase';
import { CLIENT_REPOSITORY } from './domain/repositories/client.repository';
import { ClientOrmEntity } from './infrastructure/entities/client.orm-entity';
import { TypeOrmClientRepository } from './infrastructure/repositories/typeorm-client.repository';
import { ClientController } from './presentation/client.controller';

/**
 * NestJS module that encapsulates all client-related functionality.
 * Follows clean architecture with domain, application, infrastructure, and presentation layers.
 *
 * Features:
 * - CRUD operations for trainer's clients
 * - Session package tracking
 * - JWT authentication for all endpoints
 */
@Module({
  imports: [TypeOrmModule.forFeature([ClientOrmEntity]), AuthModule],
  controllers: [ClientController],
  providers: [
    // Use cases
    GetClientsUseCase,
    CreateClientUseCase,
    DeleteClientUseCase,

    // Repository
    {
      provide: CLIENT_REPOSITORY,
      useClass: TypeOrmClientRepository,
    },
  ],
  exports: [GetClientsUseCase],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ClientModule {}
