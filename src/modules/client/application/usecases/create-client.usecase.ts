/**
 * @fileoverview Use case for creating a new client.
 * @module client/application/usecases/create-client
 */

import { ConflictException, Inject, Injectable } from '@nestjs/common';
import type { IClientRepository } from '../../domain/repositories/client.repository';
import { CLIENT_REPOSITORY } from '../../domain/repositories/client.repository';

/**
 * Input DTO for the CreateClient use case.
 */
export interface CreateClientInput {
  trainerId: string;
  name: string;
  email: string;
  phone?: string;
  sessionsTotal: number;
  packageExpiryDate: string; // ISO date string (YYYY-MM-DD)
}

/**
 * Output DTO for the CreateClient use case.
 */
export interface CreateClientOutput {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  sessionsTotal: number;
  sessionsUsed: number;
  sessionsRemaining: number;
  packageExpiryDate: string;
  createdAt: string;
}

/**
 * Use case for creating a new client for a trainer.
 */
@Injectable()
export class CreateClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
  ) {}

  /**
   * Executes the use case to create a new client.
   *
   * @param input - Client creation data
   * @returns The created client
   * @throws {ConflictException} If a client with the same email already exists for this trainer
   */
  async execute(input: CreateClientInput): Promise<CreateClientOutput> {
    // Check if client with same email already exists for this trainer
    const existing = await this.clientRepository.findByEmailAndTrainer(input.email, input.trainerId);
    if (existing) {
      throw new ConflictException('A client with this email already exists');
    }

    const client = await this.clientRepository.create({
      trainerId: input.trainerId,
      name: input.name,
      email: input.email,
      phone: input.phone,
      sessionsTotal: input.sessionsTotal,
      packageExpiryDate: new Date(input.packageExpiryDate),
    });

    return {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      sessionsTotal: client.sessionsTotal,
      sessionsUsed: client.sessionsUsed,
      sessionsRemaining: client.sessionsRemaining,
      packageExpiryDate: client.packageExpiryDate.toISOString().split('T')[0],
      createdAt: client.createdAt.toISOString(),
    };
  }
}
