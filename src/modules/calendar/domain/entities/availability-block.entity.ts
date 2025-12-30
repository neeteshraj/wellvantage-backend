/**
 * @fileoverview AvailabilityBlock domain entity representing trainer availability.
 * @module calendar/domain/entities/availability-block
 */

import { TimeRange } from '../value-objects/time-range.vo';

/**
 * Domain entity representing a time block when a trainer is available for bookings.
 * This is a pure domain object with no infrastructure dependencies.
 *
 * @example
 * ```typescript
 * const availability = AvailabilityBlock.create(
 *   'avail_123',
 *   'trainer_456',
 *   '2024-01-15',
 *   '09:00',
 *   '17:00'
 * );
 * ```
 */
export class AvailabilityBlock {
  /**
   * Creates a new AvailabilityBlock instance.
   *
   * @param id - Unique identifier for the availability block
   * @param trainerId - ID of the trainer this availability belongs to
   * @param date - Date of availability in "YYYY-MM-DD" format
   * @param timeRange - TimeRange value object representing the available time window
   */
  constructor(
    public readonly id: string,
    public readonly trainerId: string,
    public readonly date: string,
    public readonly timeRange: TimeRange,
  ) {}

  /**
   * Factory method to create an AvailabilityBlock from primitive values.
   *
   * @param id - Unique identifier for the availability block
   * @param trainerId - ID of the trainer
   * @param date - Date in "YYYY-MM-DD" format
   * @param startTime - Start time in "HH:mm" format
   * @param endTime - End time in "HH:mm" format
   * @returns New AvailabilityBlock instance
   */
  static create(id: string, trainerId: string, date: string, startTime: string, endTime: string): AvailabilityBlock {
    return new AvailabilityBlock(id, trainerId, date, new TimeRange(startTime, endTime));
  }

  /**
   * Checks if a given time range fits completely within this availability block.
   *
   * @param range - The TimeRange to check
   * @returns True if the range is fully contained within this availability
   */
  containsTimeRange(range: TimeRange): boolean {
    return this.timeRange.contains(range);
  }

  /**
   * Gets the start time of this availability block.
   *
   * @returns Start time in "HH:mm" format
   */
  get startTime(): string {
    return this.timeRange.startTime;
  }

  /**
   * Gets the end time of this availability block.
   *
   * @returns End time in "HH:mm" format
   */
  get endTime(): string {
    return this.timeRange.endTime;
  }
}
