/**
 * @fileoverview DTO for creating availability blocks.
 * @module calendar/presentation/dto/create-availability
 */

import { IsArray, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

/**
 * Data Transfer Object for creating a single trainer availability block.
 * Validates input data for the POST /calendar/availability endpoint.
 * Note: trainerId is extracted from the authenticated user, not from the request body.
 */
export class CreateAvailabilityDto {
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

/**
 * Data Transfer Object for creating multiple availability blocks at once.
 * Validates input data for the POST /calendar/availability/batch endpoint.
 * Note: trainerId is extracted from the authenticated user, not from the request body.
 */
export class CreateBatchAvailabilityDto {
  /**
   * Array of dates for the availability blocks.
   * Each date must be in ISO 8601 date format (YYYY-MM-DD).
   * @example ["2024-01-15", "2024-01-16", "2024-01-17"]
   */
  @IsArray({ message: 'Dates must be an array' })
  @IsNotEmpty({ message: 'At least one date is required' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    each: true,
    message: 'Each date must be in YYYY-MM-DD format',
  })
  dates!: string[];

  /**
   * Start time of availability for all dates.
   * Must be in 24-hour format (HH:mm).
   * @example "09:00"
   */
  @IsNotEmpty({ message: 'Start time is required' })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'Start time must be in HH:mm format (24-hour)',
  })
  startTime!: string;

  /**
   * End time of availability for all dates.
   * Must be in 24-hour format (HH:mm).
   * Must be after startTime.
   * @example "17:00"
   */
  @IsNotEmpty({ message: 'End time is required' })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'End time must be in HH:mm format (24-hour)',
  })
  endTime!: string;

  /**
   * Optional session name/type for the availability blocks.
   * @example "PT"
   */
  @IsOptional()
  @IsString({ message: 'Session name must be a string' })
  sessionName?: string;
}
