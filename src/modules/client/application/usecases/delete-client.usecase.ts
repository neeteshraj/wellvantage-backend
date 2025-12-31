/**
 * @fileoverview Use case for deleting a client.
 * @module client/application/usecases/delete-client
 */

import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import type { IClientRepository } from '../../domain/repositories/client.repository';
import { CLIENT_REPOSITORY } from '../../domain/repositories/client.repository';

/**
 * Input DTO for the DeleteClient use case.
 */
export interface DeleteClientInput {
  clientId: string;
  trainerId: string; // Used to verify ownership
}

/**
 * Use case for deleting a client.
 */
@Injectable()
export class DeleteClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
  ) {}

  /**
   * Executes the use case to delete a client.
   *
   * @param input - Contains the client ID and trainer ID for ownership verification
   * @throws {NotFoundException} If the client doesn't exist
   * @throws {ForbiddenException} If the trainer doesn't own this client
   */
  async execute(input: DeleteClientInput): Promise<void> {
    const client = await this.clientRepository.findById(input.clientId);

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    if (client.trainerId !== input.trainerId) {
      throw new ForbiddenException('You do not have permission to delete this client');
    }

    await this.clientRepository.delete(input.clientId);
  }
}
