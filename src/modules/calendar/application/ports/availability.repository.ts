/**
 * @fileoverview Repository interface for availability block persistence.
 * @module calendar/application/ports/availability-repository
 */

import { AvailabilityBlock } from '../../domain/entities/availability-block.entity';

/**
 * Repository interface defining the contract for availability block persistence.
 * Infrastructure layer provides concrete implementations (e.g., TypeORM, Prisma).
 * This follows the Dependency Inversion Principle of Clean Architecture.
 */
export interface AvailabilityRepository {
  /**
   * Persists an availability block.
   *
   * @param block - The availability block to save
   * @returns The saved availability block
   */
  save(block: AvailabilityBlock): Promise<AvailabilityBlock>;

  /**
   * Finds all availability blocks for a trainer on a specific date.
   *
   * @param trainerId - The trainer's unique identifier
   * @param date - Date in "YYYY-MM-DD" format
   * @returns Array of availability blocks, sorted by start time
   */
  findByTrainerAndDate(trainerId: string, date: string): Promise<AvailabilityBlock[]>;

  /**
   * Finds all availability blocks for a trainer within a date range.
   *
   * @param trainerId - The trainer's unique identifier
   * @param fromDate - Start date in "YYYY-MM-DD" format (inclusive)
   * @param toDate - End date in "YYYY-MM-DD" format (inclusive)
   * @returns Array of availability blocks, sorted by date and start time
   */
  findByTrainerAndDateRange(trainerId: string, fromDate: string, toDate: string): Promise<AvailabilityBlock[]>;

  /**
   * Finds a specific availability block by its unique identifier.
   *
   * @param id - The availability block's unique identifier
   * @returns The availability block if found, null otherwise
   */
  findById(id: string): Promise<AvailabilityBlock | null>;

  /**
   * Deletes an availability block by its unique identifier.
   *
   * @param id - The availability block's unique identifier
   */
  delete(id: string): Promise<void>;
}

/**
 * Dependency injection token for AvailabilityRepository.
 * Use this symbol when injecting the repository in NestJS providers.
 *
 * @example
 * ```typescript
 * constructor(
 *   @Inject(AVAILABILITY_REPOSITORY)
 *   private readonly availabilityRepository: AvailabilityRepository,
 * ) {}
 * ```
 */
export const AVAILABILITY_REPOSITORY = Symbol('AVAILABILITY_REPOSITORY');
