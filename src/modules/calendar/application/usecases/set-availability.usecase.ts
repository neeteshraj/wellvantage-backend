/**
 * @fileoverview Use case for setting trainer availability.
 * @module calendar/application/usecases/set-availability
 */

import { Inject, Injectable } from '@nestjs/common';
import { AvailabilityBlock } from '../../domain/entities/availability-block.entity';
import type { AvailabilityRepository } from '../ports/availability.repository';
import { AVAILABILITY_REPOSITORY } from '../ports/availability.repository';

/**
 * Input DTO for the SetAvailability use case.
 */
export interface SetAvailabilityInput {
  /** Trainer's unique identifier */
  trainerId: string;
  /** Date in "YYYY-MM-DD" format */
  date: string;
  /** Start time in "HH:mm" format */
  startTime: string;
  /** End time in "HH:mm" format */
  endTime: string;
}

/**
 * Output DTO for the SetAvailability use case.
 */
export interface SetAvailabilityOutput {
  /** Generated unique identifier for the availability block */
  id: string;
  /** Trainer's unique identifier */
  trainerId: string;
  /** Date in "YYYY-MM-DD" format */
  date: string;
  /** Start time in "HH:mm" format */
  startTime: string;
  /** End time in "HH:mm" format */
  endTime: string;
}

/**
 * Use case for creating a new availability block for a trainer.
 * Handles the business logic of setting when a trainer is available for bookings.
 *
 * @example
 * ```typescript
 * const result = await setAvailabilityUseCase.execute({
 *   trainerId: 'trainer_123',
 *   date: '2024-01-15',
 *   startTime: '09:00',
 *   endTime: '17:00',
 * });
 * ```
 */
@Injectable()
export class SetAvailabilityUseCase {
  /**
   * Creates a new SetAvailabilityUseCase instance.
   *
   * @param availabilityRepository - Repository for availability block persistence
   */
  constructor(
    @Inject(AVAILABILITY_REPOSITORY)
    private readonly availabilityRepository: AvailabilityRepository,
  ) {}

  /**
   * Executes the use case to create a new availability block.
   *
   * @param input - The availability data to create
   * @returns The created availability block data
   */
  async execute(input: SetAvailabilityInput): Promise<SetAvailabilityOutput> {
    const id = this.generateId();

    const availabilityBlock = AvailabilityBlock.create(id, input.trainerId, input.date, input.startTime, input.endTime);

    const savedBlock = await this.availabilityRepository.save(availabilityBlock);

    return {
      id: savedBlock.id,
      trainerId: savedBlock.trainerId,
      date: savedBlock.date,
      startTime: savedBlock.startTime,
      endTime: savedBlock.endTime,
    };
  }

  /**
   * Generates a unique identifier for an availability block.
   *
   * @returns Unique identifier string
   * @private
   */
  private generateId(): string {
    return `avail_${String(Date.now())}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
