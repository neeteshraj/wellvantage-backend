/**
 * @fileoverview DTOs for availability and booking query parameters.
 * @module calendar/presentation/dto/query-availability
 */

import { IsNotEmpty, IsString, Matches } from 'class-validator';

/**
 * Data Transfer Object for querying trainer availability.
 * Validates query parameters for the GET /calendar/availability endpoint.
 * Uses class-validator decorators for automatic validation.
 */
export class QueryAvailabilityDto {
  /**
   * Trainer's unique identifier.
   * @example "trainer_123"
   */
  @IsNotEmpty({ message: 'Trainer ID is required' })
  @IsString({ message: 'Trainer ID must be a string' })
  trainerId!: string;

  /**
   * Date to query availability for.
   * Must be in ISO 8601 date format (YYYY-MM-DD).
   * @example "2024-01-15"
   */
  @IsNotEmpty({ message: 'Date is required' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  date!: string;
}

/**
 * Data Transfer Object for querying bookings within a date range.
 * Validates query parameters for the GET /calendar/bookings endpoint.
 * Uses class-validator decorators for automatic validation.
 */
export class QueryBookingsDto {
  /**
   * Trainer's unique identifier.
   * @example "trainer_123"
   */
  @IsNotEmpty({ message: 'Trainer ID is required' })
  @IsString({ message: 'Trainer ID must be a string' })
  trainerId!: string;

  /**
   * Start date of the query range (inclusive).
   * Must be in ISO 8601 date format (YYYY-MM-DD).
   * @example "2024-01-01"
   */
  @IsNotEmpty({ message: 'From date is required' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'From date must be in YYYY-MM-DD format',
  })
  from!: string;

  /**
   * End date of the query range (inclusive).
   * Must be in ISO 8601 date format (YYYY-MM-DD).
   * @example "2024-01-31"
   */
  @IsNotEmpty({ message: 'To date is required' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'To date must be in YYYY-MM-DD format',
  })
  to!: string;
}
