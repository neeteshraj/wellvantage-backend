/**
 * @fileoverview Booking domain entity representing a scheduled appointment.
 * @module calendar/domain/entities/booking
 */

import { TimeRange } from '../value-objects/time-range.vo';

/**
 * Possible states for a booking.
 */
export type BookingStatus = 'confirmed' | 'cancelled';

/**
 * Domain entity representing a scheduled appointment between a trainer and member.
 * This is a pure domain object with no infrastructure dependencies.
 *
 * @example
 * ```typescript
 * const booking = Booking.create(
 *   'book_123',
 *   'trainer_456',
 *   'member_789',
 *   '2024-01-15',
 *   '10:00',
 *   '11:00'
 * );
 * ```
 */
export class Booking {
  /**
   * Creates a new Booking instance.
   *
   * @param id - Unique identifier for the booking
   * @param trainerId - ID of the trainer
   * @param memberId - ID of the member who made the booking
   * @param date - Date of the booking in "YYYY-MM-DD" format
   * @param timeRange - TimeRange value object representing the booked time slot
   * @param status - Current status of the booking
   * @param createdAt - Timestamp when the booking was created
   */
  constructor(
    public readonly id: string,
    public readonly trainerId: string,
    public readonly memberId: string,
    public readonly date: string,
    public readonly timeRange: TimeRange,
    public readonly status: BookingStatus = 'confirmed',
    public readonly createdAt: Date = new Date(),
  ) {}

  /**
   * Factory method to create a new confirmed Booking from primitive values.
   *
   * @param id - Unique identifier for the booking
   * @param trainerId - ID of the trainer
   * @param memberId - ID of the member
   * @param date - Date in "YYYY-MM-DD" format
   * @param startTime - Start time in "HH:mm" format
   * @param endTime - End time in "HH:mm" format
   * @returns New Booking instance with confirmed status
   */
  static create(
    id: string,
    trainerId: string,
    memberId: string,
    date: string,
    startTime: string,
    endTime: string,
  ): Booking {
    return new Booking(id, trainerId, memberId, date, new TimeRange(startTime, endTime), 'confirmed', new Date());
  }

  /**
   * Checks if this booking overlaps with a given time range.
   *
   * @param range - The TimeRange to check against
   * @returns True if there is any overlap
   */
  overlapsWithTimeRange(range: TimeRange): boolean {
    return this.timeRange.overlaps(range);
  }

  /**
   * Checks if this booking overlaps with another booking on the same date.
   *
   * @param other - The other Booking to check against
   * @returns True if bookings overlap on the same date
   */
  overlapsWith(other: Booking): boolean {
    return this.date === other.date && this.timeRange.overlaps(other.timeRange);
  }

  /**
   * Gets the start time of this booking.
   *
   * @returns Start time in "HH:mm" format
   */
  get startTime(): string {
    return this.timeRange.startTime;
  }

  /**
   * Gets the end time of this booking.
   *
   * @returns End time in "HH:mm" format
   */
  get endTime(): string {
    return this.timeRange.endTime;
  }

  /**
   * Checks if the booking is in confirmed status.
   *
   * @returns True if booking status is 'confirmed'
   */
  isConfirmed(): boolean {
    return this.status === 'confirmed';
  }
}
