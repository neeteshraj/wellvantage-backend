/**
 * @fileoverview TimeRange Value Object for representing time intervals.
 * @module calendar/domain/value-objects/time-range
 */

/**
 * Immutable value object representing a time interval.
 * Provides methods for overlap detection, containment checking, and validation.
 *
 * @example
 * ```typescript
 * const range = new TimeRange('09:00', '10:30');
 * const other = new TimeRange('10:00', '11:00');
 * console.log(range.overlaps(other)); // true
 * ```
 */
export class TimeRange {
  /**
   * Creates a new TimeRange instance.
   *
   * @param startTime - Start time in "HH:mm" format (24-hour)
   * @param endTime - End time in "HH:mm" format (24-hour)
   * @throws {Error} If startTime is not before endTime
   */
  constructor(
    public readonly startTime: string,
    public readonly endTime: string,
  ) {
    this.validate();
  }

  /**
   * Validates that the time range is valid (start before end).
   *
   * @throws {Error} If start time is not before end time
   * @private
   */
  private validate(): void {
    const start = this.toMinutes(this.startTime);
    const end = this.toMinutes(this.endTime);

    if (start >= end) {
      throw new Error('Start time must be before end time');
    }
  }

  /**
   * Converts a time string to minutes since midnight.
   *
   * @param time - Time string in "HH:mm" format
   * @returns Number of minutes since midnight
   * @private
   */
  private toMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Calculates the duration of this time range in minutes.
   *
   * @returns Duration in minutes
   */
  getDurationMinutes(): number {
    return this.toMinutes(this.endTime) - this.toMinutes(this.startTime);
  }

  /**
   * Checks if this time range overlaps with another.
   * Two ranges overlap if they share any time (exclusive of exact boundary touch).
   *
   * @param other - The other TimeRange to check against
   * @returns True if the ranges overlap, false otherwise
   *
   * @example
   * ```typescript
   * const range1 = new TimeRange('09:00', '10:00');
   * const range2 = new TimeRange('09:30', '10:30');
   * console.log(range1.overlaps(range2)); // true
   * ```
   */
  overlaps(other: TimeRange): boolean {
    const thisStart = this.toMinutes(this.startTime);
    const thisEnd = this.toMinutes(this.endTime);
    const otherStart = this.toMinutes(other.startTime);
    const otherEnd = this.toMinutes(other.endTime);

    return thisStart < otherEnd && otherStart < thisEnd;
  }

  /**
   * Checks if this time range fully contains another.
   *
   * @param other - The other TimeRange to check
   * @returns True if this range fully contains the other range
   *
   * @example
   * ```typescript
   * const outer = new TimeRange('09:00', '12:00');
   * const inner = new TimeRange('10:00', '11:00');
   * console.log(outer.contains(inner)); // true
   * ```
   */
  contains(other: TimeRange): boolean {
    const thisStart = this.toMinutes(this.startTime);
    const thisEnd = this.toMinutes(this.endTime);
    const otherStart = this.toMinutes(other.startTime);
    const otherEnd = this.toMinutes(other.endTime);

    return thisStart <= otherStart && thisEnd >= otherEnd;
  }

  /**
   * Checks equality with another TimeRange.
   *
   * @param other - The other TimeRange to compare
   * @returns True if both ranges have the same start and end times
   */
  equals(other: TimeRange): boolean {
    return this.startTime === other.startTime && this.endTime === other.endTime;
  }

  /**
   * Returns a string representation of the time range.
   *
   * @returns String in format "HH:mm-HH:mm"
   */
  toString(): string {
    return `${this.startTime}-${this.endTime}`;
  }
}
