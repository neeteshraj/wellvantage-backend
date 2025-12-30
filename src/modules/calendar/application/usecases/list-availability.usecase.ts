/**
 * @fileoverview Use case for listing trainer availability and generating slots.
 * @module calendar/application/usecases/list-availability
 */

import { Inject, Injectable } from '@nestjs/common';
import { Slot, SlotPolicyService } from '../../domain/services/slot-policy.service';
import type { AvailabilityRepository } from '../ports/availability.repository';
import { AVAILABILITY_REPOSITORY } from '../ports/availability.repository';
import type { BookingRepository } from '../ports/booking.repository';
import { BOOKING_REPOSITORY } from '../ports/booking.repository';

/**
 * Input DTO for the ListAvailability use case.
 */
export interface ListAvailabilityInput {
  /** Trainer's unique identifier */
  trainerId: string;
  /** Date in "YYYY-MM-DD" format */
  date: string;
}

/**
 * Output representation of an availability block.
 */
export interface AvailabilityBlockOutput {
  /** Unique identifier of the availability block */
  id: string;
  /** Start time in "HH:mm" format */
  startTime: string;
  /** End time in "HH:mm" format */
  endTime: string;
}

/**
 * Output DTO for the ListAvailability use case.
 */
export interface ListAvailabilityOutput {
  /** Trainer's unique identifier */
  trainerId: string;
  /** Date in "YYYY-MM-DD" format */
  date: string;
  /** List of availability blocks for the day */
  blocks: AvailabilityBlockOutput[];
  /** Generated time slots with availability status */
  slots: Slot[];
}

/**
 * Use case for retrieving trainer availability and generating bookable time slots.
 * Combines availability blocks with existing bookings to show which slots are available.
 *
 * @example
 * ```typescript
 * const result = await listAvailabilityUseCase.execute({
 *   trainerId: 'trainer_123',
 *   date: '2024-01-15',
 * });
 * // result.slots will contain 30-minute slots marked as available or not
 * ```
 */
@Injectable()
export class ListAvailabilityUseCase {
  /** Domain service for slot generation */
  private readonly slotPolicyService: SlotPolicyService;

  /**
   * Creates a new ListAvailabilityUseCase instance.
   *
   * @param availabilityRepository - Repository for availability block persistence
   * @param bookingRepository - Repository for booking persistence
   */
  constructor(
    @Inject(AVAILABILITY_REPOSITORY)
    private readonly availabilityRepository: AvailabilityRepository,
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,
  ) {
    this.slotPolicyService = new SlotPolicyService(30);
  }

  /**
   * Executes the use case to retrieve availability and generate slots.
   *
   * @param input - The query parameters
   * @returns Availability blocks and generated slots for the trainer on the specified date
   */
  async execute(input: ListAvailabilityInput): Promise<ListAvailabilityOutput> {
    const availabilityBlocks = await this.availabilityRepository.findByTrainerAndDate(input.trainerId, input.date);

    const existingBookings = await this.bookingRepository.findConfirmedByTrainerAndDate(input.trainerId, input.date);

    const slots = this.slotPolicyService.generateSlots(availabilityBlocks, existingBookings);

    const blocks: AvailabilityBlockOutput[] = availabilityBlocks.map((block) => ({
      id: block.id,
      startTime: block.startTime,
      endTime: block.endTime,
    }));

    return {
      trainerId: input.trainerId,
      date: input.date,
      blocks,
      slots,
    };
  }
}
