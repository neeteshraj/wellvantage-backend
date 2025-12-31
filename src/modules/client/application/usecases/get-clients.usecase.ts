/**
 * @fileoverview Use case for getting a trainer's clients.
 * @module client/application/usecases/get-clients
 */

import { Inject, Injectable } from '@nestjs/common';
import { Client } from '../../domain/entities/client.entity';
import type { IClientRepository } from '../../domain/repositories/client.repository';
import { CLIENT_REPOSITORY } from '../../domain/repositories/client.repository';

/**
 * Input DTO for the GetClients use case.
 */
export interface GetClientsInput {
  /** ID of the trainer */
  trainerId: string;
}

/**
 * Output DTO for a single client.
 */
export interface ClientOutput {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  sessionsTotal: number;
  sessionsUsed: number;
  sessionsRemaining: number;
  packageExpiryDate: string;
  isExpired: boolean;
  createdAt: string;
}

/**
 * Output DTO for the GetClients use case.
 */
export interface GetClientsOutput {
  clients: ClientOutput[];
}

/**
 * Use case for retrieving all clients belonging to a trainer.
 */
@Injectable()
export class GetClientsUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
  ) {}

  /**
   * Maps a domain Client to output format.
   */
  private toOutput(client: Client): ClientOutput {
    return {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      sessionsTotal: client.sessionsTotal,
      sessionsUsed: client.sessionsUsed,
      sessionsRemaining: client.sessionsRemaining,
      packageExpiryDate: client.packageExpiryDate.toISOString().split('T')[0],
      isExpired: client.isExpired,
      createdAt: client.createdAt.toISOString(),
    };
  }

  /**
   * Executes the use case to get all clients for a trainer.
   *
   * @param input - Contains the trainer ID
   * @returns List of clients
   */
  async execute(input: GetClientsInput): Promise<GetClientsOutput> {
    const clients = await this.clientRepository.findByTrainerId(input.trainerId);
    return {
      clients: clients.map((client) => this.toOutput(client)),
    };
  }
}
