/**
 * @fileoverview Domain service for generating time slots from availability blocks.
 * @module calendar/domain/services/slot-policy
 */

import { AvailabilityBlock } from '../entities/availability-block.entity';
import { Booking } from '../entities/booking.entity';
import { TimeRange } from '../value-objects/time-range.vo';

/**
 * Represents a bookable time slot.
 */
export interface Slot {
  /** Start time in "HH:mm" format */
  startTime: string;
  /** End time in "HH:mm" format */
  endTime: string;
  /** Whether this slot is available for booking */
  available: boolean;
}

/**
 * Domain service responsible for generating bookable time slots from availability blocks.
 * Considers existing bookings to mark slots as available or unavailable.
 *
 * @example
 * ```typescript
 * const service = new SlotPolicyService(30);
 * const slots = service.generateSlots(availabilityBlocks, existingBookings);
 * ```
 */
export class SlotPolicyService {
  /**
   * Creates a new SlotPolicyService instance.
   *
   * @param defaultSlotDurationMinutes - Default duration for generated slots in minutes
   */
  constructor(private readonly defaultSlotDurationMinutes: number = 30) {}

  /**
   * Generates time slots from availability blocks, marking each slot as
   * available or unavailable based on existing bookings.
   *
   * @param availabilityBlocks - Array of availability blocks to generate slots from
   * @param existingBookings - Array of existing bookings to check against
   * @param slotDurationMinutes - Duration of each slot in minutes (defaults to constructor value)
   * @returns Array of slots sorted by start time
   */
  generateSlots(
    availabilityBlocks: AvailabilityBlock[],
    existingBookings: Booking[],
    slotDurationMinutes: number = this.defaultSlotDurationMinutes,
  ): Slot[] {
    const slots: Slot[] = [];

    for (const block of availabilityBlocks) {
      const blockSlots = this.generateSlotsFromBlock(block, existingBookings, slotDurationMinutes);
      slots.push(...blockSlots);
    }

    return slots.sort((a, b) => {
      return this.timeToMinutes(a.startTime) - this.timeToMinutes(b.startTime);
    });
  }

  /**
   * Generates slots from a single availability block.
   *
   * @param block - The availability block to generate slots from
   * @param existingBookings - Array of existing bookings to check against
   * @param slotDurationMinutes - Duration of each slot in minutes
   * @returns Array of slots for this block
   * @private
   */
  private generateSlotsFromBlock(
    block: AvailabilityBlock,
    existingBookings: Booking[],
    slotDurationMinutes: number,
  ): Slot[] {
    const slots: Slot[] = [];
    const startMinutes = this.timeToMinutes(block.startTime);
    const endMinutes = this.timeToMinutes(block.endTime);

    const relevantBookings = existingBookings.filter(
      (booking) => booking.trainerId === block.trainerId && booking.date === block.date && booking.isConfirmed(),
    );

    let currentMinutes = startMinutes;

    while (currentMinutes + slotDurationMinutes <= endMinutes) {
      const slotStart = this.minutesToTime(currentMinutes);
      const slotEnd = this.minutesToTime(currentMinutes + slotDurationMinutes);
      const slotRange = new TimeRange(slotStart, slotEnd);

      const isBooked = relevantBookings.some((booking) => booking.overlapsWithTimeRange(slotRange));

      slots.push({
        startTime: slotStart,
        endTime: slotEnd,
        available: !isBooked,
      });

      currentMinutes += slotDurationMinutes;
    }

    return slots;
  }

  /**
   * Converts a time string to minutes since midnight.
   *
   * @param time - Time string in "HH:mm" format
   * @returns Number of minutes since midnight
   * @private
   */
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Converts minutes since midnight to a time string.
   *
   * @param minutes - Number of minutes since midnight
   * @returns Time string in "HH:mm" format
   * @private
   */
  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }
}
