/**
 * @fileoverview Use case for creating bookings with collision detection.
 * @module calendar/application/usecases/create-booking
 */

import { Inject, Injectable } from '@nestjs/common';
import { Booking } from '../../domain/entities/booking.entity';
import { BookingCollisionError } from '../../domain/errors/booking-collision.error';
import { TimeRange } from '../../domain/value-objects/time-range.vo';
import type { AvailabilityRepository } from '../ports/availability.repository';
import { AVAILABILITY_REPOSITORY } from '../ports/availability.repository';
import type { BookingRepository } from '../ports/booking.repository';
import { BOOKING_REPOSITORY } from '../ports/booking.repository';

/**
 * Input DTO for the CreateBooking use case.
 */
export interface CreateBookingInput {
  /** Trainer's unique identifier */
  trainerId: string;
  /** Member's unique identifier */
  memberId: string;
  /** Date in "YYYY-MM-DD" format */
  date: string;
  /** Start time in "HH:mm" format */
  startTime: string;
  /** End time in "HH:mm" format */
  endTime: string;
}

/**
 * Output DTO for the CreateBooking use case.
 */
export interface CreateBookingOutput {
  /** Generated unique identifier for the booking */
  id: string;
  /** Trainer's unique identifier */
  trainerId: string;
  /** Member's unique identifier */
  memberId: string;
  /** Date in "YYYY-MM-DD" format */
  date: string;
  /** Start time in "HH:mm" format */
  startTime: string;
  /** End time in "HH:mm" format */
  endTime: string;
  /** Booking status (confirmed/cancelled) */
  status: string;
  /** Timestamp when the booking was created */
  createdAt: Date;
}

/**
 * Use case for creating a new booking with validation.
 * Performs two key validations:
 * 1. Ensures the booking time falls within trainer's availability
 * 2. Checks for collisions with existing bookings
 *
 * @throws {BookingCollisionError} When booking is outside availability or overlaps existing booking
 *
 * @example
 * ```typescript
 * try {
 *   const result = await createBookingUseCase.execute({
 *     trainerId: 'trainer_123',
 *     memberId: 'member_456',
 *     date: '2024-01-15',
 *     startTime: '10:00',
 *     endTime: '11:00',
 *   });
 * } catch (error) {
 *   if (error instanceof BookingCollisionError) {
 *     // Handle collision - return 409 Conflict
 *   }
 * }
 * ```
 */
@Injectable()
export class CreateBookingUseCase {
  /**
   * Creates a new CreateBookingUseCase instance.
   *
   * @param availabilityRepository - Repository for availability block persistence
   * @param bookingRepository - Repository for booking persistence
   */
  constructor(
    @Inject(AVAILABILITY_REPOSITORY)
    private readonly availabilityRepository: AvailabilityRepository,
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,
  ) {}

  /**
   * Executes the use case to create a new booking.
   *
   * @param input - The booking data to create
   * @returns The created booking data
   * @throws {BookingCollisionError} When booking conflicts with availability or existing bookings
   */
  async execute(input: CreateBookingInput): Promise<CreateBookingOutput> {
    const requestedTimeRange = new TimeRange(input.startTime, input.endTime);

    await this.validateWithinAvailability(input, requestedTimeRange);

    await this.checkForCollisions(input, requestedTimeRange);

    const booking = Booking.create(
      this.generateId(),
      input.trainerId,
      input.memberId,
      input.date,
      input.startTime,
      input.endTime,
    );

    const savedBooking = await this.bookingRepository.save(booking);

    return {
      id: savedBooking.id,
      trainerId: savedBooking.trainerId,
      memberId: savedBooking.memberId,
      date: savedBooking.date,
      startTime: savedBooking.startTime,
      endTime: savedBooking.endTime,
      status: savedBooking.status,
      createdAt: savedBooking.createdAt,
    };
  }

  /**
   * Validates that the requested booking time is within trainer's availability.
   *
   * @param input - The booking input data
   * @param requestedTimeRange - The time range to validate
   * @throws {BookingCollisionError} When time is outside availability
   * @private
   */
  private async validateWithinAvailability(input: CreateBookingInput, requestedTimeRange: TimeRange): Promise<void> {
    const availabilityBlocks = await this.availabilityRepository.findByTrainerAndDate(input.trainerId, input.date);

    const fitsInAvailability = availabilityBlocks.some((block) => block.containsTimeRange(requestedTimeRange));

    if (!fitsInAvailability) {
      throw BookingCollisionError.outsideAvailability(input.trainerId, input.date, input.startTime, input.endTime);
    }
  }

  /**
   * Checks for overlapping bookings (collision detection).
   *
   * @param input - The booking input data
   * @param requestedTimeRange - The time range to check
   * @throws {BookingCollisionError} When there's an overlap with existing booking
   * @private
   */
  private async checkForCollisions(input: CreateBookingInput, requestedTimeRange: TimeRange): Promise<void> {
    const existingBookings = await this.bookingRepository.findConfirmedByTrainerAndDate(input.trainerId, input.date);

    for (const existingBooking of existingBookings) {
      if (existingBooking.overlapsWithTimeRange(requestedTimeRange)) {
        throw BookingCollisionError.overlap(
          input.trainerId,
          input.date,
          input.startTime,
          input.endTime,
          existingBooking.id,
        );
      }
    }
  }

  /**
   * Generates a unique identifier for a booking.
   *
   * @returns Unique identifier string
   * @private
   */
  private generateId(): string {
    return `book_${String(Date.now())}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
