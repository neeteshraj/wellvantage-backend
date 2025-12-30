/**
 * @fileoverview DTO for creating bookings.
 * @module calendar/presentation/dto/create-booking
 */

import { IsNotEmpty, IsString, Matches } from 'class-validator';

/**
 * Data Transfer Object for creating bookings.
 * Validates input data for the POST /calendar/book endpoint.
 * Uses class-validator decorators for automatic validation.
 */
export class CreateBookingDto {
  /**
   * Trainer's unique identifier.
   * @example "trainer_123"
   */
  @IsNotEmpty({ message: 'Trainer ID is required' })
  @IsString({ message: 'Trainer ID must be a string' })
  trainerId!: string;

  /**
   * Member's unique identifier who is making the booking.
   * @example "member_456"
   */
  @IsNotEmpty({ message: 'Member ID is required' })
  @IsString({ message: 'Member ID must be a string' })
  memberId!: string;

  /**
   * Date for the booking.
   * Must be in ISO 8601 date format (YYYY-MM-DD).
   * @example "2024-01-15"
   */
  @IsNotEmpty({ message: 'Date is required' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  date!: string;

  /**
   * Start time of the booking.
   * Must be in 24-hour format (HH:mm).
   * @example "10:00"
   */
  @IsNotEmpty({ message: 'Start time is required' })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'Start time must be in HH:mm format (24-hour)',
  })
  startTime!: string;

  /**
   * End time of the booking.
   * Must be in 24-hour format (HH:mm).
   * Must be after startTime.
   * @example "10:30"
   */
  @IsNotEmpty({ message: 'End time is required' })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'End time must be in HH:mm format (24-hour)',
  })
  endTime!: string;
}
