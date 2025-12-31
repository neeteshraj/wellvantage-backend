/**
 * @fileoverview Repository interface for client persistence operations.
 * @module client/domain/repositories/client-repository
 */

import { Client } from '../entities/client.entity';

/**
 * Data required to create a new client.
 */
export interface CreateClientData {
  trainerId: string;
  name: string;
  email: string;
  phone?: string;
  sessionsTotal: number;
  packageExpiryDate: Date;
}

/**
 * Data for updating an existing client.
 */
export interface UpdateClientData {
  name?: string;
  email?: string;
  phone?: string;
  sessionsTotal?: number;
  sessionsUsed?: number;
  packageExpiryDate?: Date;
}

/**
 * Repository interface for client persistence.
 * Defines the contract for data access operations.
 */
export interface IClientRepository {
  /**
   * Find a client by their unique ID.
   */
  findById(id: string): Promise<Client | null>;

  /**
   * Find all clients belonging to a trainer.
   */
  findByTrainerId(trainerId: string): Promise<Client[]>;

  /**
   * Find a client by email for a specific trainer.
   */
  findByEmailAndTrainer(email: string, trainerId: string): Promise<Client | null>;

  /**
   * Create a new client.
   */
  create(data: CreateClientData): Promise<Client>;

  /**
   * Update an existing client.
   */
  update(id: string, data: UpdateClientData): Promise<Client>;

  /**
   * Delete a client by ID.
   */
  delete(id: string): Promise<void>;

  /**
   * Increment sessions used for a client.
   */
  incrementSessionsUsed(id: string): Promise<Client>;
}

/**
 * Token for dependency injection of the client repository.
 */
export const CLIENT_REPOSITORY = Symbol('CLIENT_REPOSITORY');
