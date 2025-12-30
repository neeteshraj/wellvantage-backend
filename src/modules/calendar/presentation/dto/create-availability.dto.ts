/**
 * @fileoverview DTO for creating availability blocks.
 * @module calendar/presentation/dto/create-availability
 */

import { IsNotEmpty, IsString, Matches } from 'class-validator';

/**
 * Data Transfer Object for creating trainer availability blocks.
 * Validates input data for the POST /calendar/availability endpoint.
 * Uses class-validator decorators for automatic validation.
 */
export class CreateAvailabilityDto {
  /**
   * Trainer's unique identifier.
   * @example "trainer_123"
   */
  @IsNotEmpty({ message: 'Trainer ID is required' })
  @IsString({ message: 'Trainer ID must be a string' })
  trainerId!: string;

  /**
   * Date for the availability block.
   * Must be in ISO 8601 date format (YYYY-MM-DD).
   * @example "2024-01-15"
   */
  @IsNotEmpty({ message: 'Date is required' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  date!: string;

  /**
   * Start time of availability.
   * Must be in 24-hour format (HH:mm).
   * @example "09:00"
   */
  @IsNotEmpty({ message: 'Start time is required' })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'Start time must be in HH:mm format (24-hour)',
  })
  startTime!: string;

  /**
   * End time of availability.
   * Must be in 24-hour format (HH:mm).
   * Must be after startTime.
   * @example "17:00"
   */
  @IsNotEmpty({ message: 'End time is required' })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'End time must be in HH:mm format (24-hour)',
  })
  endTime!: string;
}
