/**
 * @fileoverview Use case for listing bookings within a date range.
 * @module calendar/application/usecases/list-bookings
 */

import { Inject, Injectable } from '@nestjs/common';
import type { BookingRepository } from '../ports/booking.repository';
import { BOOKING_REPOSITORY } from '../ports/booking.repository';

/**
 * Input DTO for the ListBookings use case.
 */
export interface ListBookingsInput {
  /** Trainer's unique identifier */
  trainerId: string;
  /** Start date in "YYYY-MM-DD" format (inclusive) */
  fromDate: string;
  /** End date in "YYYY-MM-DD" format (inclusive) */
  toDate: string;
}

/**
 * Output representation of a booking.
 */
export interface BookingOutput {
  /** Unique identifier of the booking */
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
 * Output DTO for the ListBookings use case.
 */
export interface ListBookingsOutput {
  /** Trainer's unique identifier */
  trainerId: string;
  /** Start date of the query range */
  fromDate: string;
  /** End date of the query range */
  toDate: string;
  /** List of bookings within the date range */
  bookings: BookingOutput[];
}

/**
 * Use case for retrieving all bookings for a trainer within a date range.
 *
 * @example
 * ```typescript
 * const result = await listBookingsUseCase.execute({
 *   trainerId: 'trainer_123',
 *   fromDate: '2024-01-01',
 *   toDate: '2024-01-31',
 * });
 * // result.bookings contains all bookings for January 2024
 * ```
 */
@Injectable()
export class ListBookingsUseCase {
  /**
   * Creates a new ListBookingsUseCase instance.
   *
   * @param bookingRepository - Repository for booking persistence
   */
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,
  ) {}

  /**
   * Executes the use case to retrieve bookings within the specified date range.
   *
   * @param input - The query parameters
   * @returns List of bookings for the trainer within the date range
   */
  async execute(input: ListBookingsInput): Promise<ListBookingsOutput> {
    const bookings = await this.bookingRepository.findByTrainerAndDateRange(
      input.trainerId,
      input.fromDate,
      input.toDate,
    );

    const bookingOutputs: BookingOutput[] = bookings.map((booking) => ({
      id: booking.id,
      trainerId: booking.trainerId,
      memberId: booking.memberId,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      createdAt: booking.createdAt,
    }));

    return {
      trainerId: input.trainerId,
      fromDate: input.fromDate,
      toDate: input.toDate,
      bookings: bookingOutputs,
    };
  }
}
