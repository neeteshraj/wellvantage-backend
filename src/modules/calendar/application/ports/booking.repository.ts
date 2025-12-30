/**
 * @fileoverview Repository interface for booking persistence.
 * @module calendar/application/ports/booking-repository
 */

import { Booking } from '../../domain/entities/booking.entity';

/**
 * Repository interface defining the contract for booking persistence.
 * Infrastructure layer provides concrete implementations (e.g., TypeORM, Prisma).
 * This follows the Dependency Inversion Principle of Clean Architecture.
 */
export interface BookingRepository {
  /**
   * Persists a booking.
   *
   * @param booking - The booking to save
   * @returns The saved booking
   */
  save(booking: Booking): Promise<Booking>;

  /**
   * Finds all bookings for a trainer on a specific date.
   *
   * @param trainerId - The trainer's unique identifier
   * @param date - Date in "YYYY-MM-DD" format
   * @returns Array of bookings, sorted by start time
   */
  findByTrainerAndDate(trainerId: string, date: string): Promise<Booking[]>;

  /**
   * Finds all bookings for a trainer within a date range.
   *
   * @param trainerId - The trainer's unique identifier
   * @param fromDate - Start date in "YYYY-MM-DD" format (inclusive)
   * @param toDate - End date in "YYYY-MM-DD" format (inclusive)
   * @returns Array of bookings, sorted by date and start time
   */
  findByTrainerAndDateRange(trainerId: string, fromDate: string, toDate: string): Promise<Booking[]>;

  /**
   * Finds all bookings for a specific member.
   *
   * @param memberId - The member's unique identifier
   * @returns Array of bookings, sorted by date and start time
   */
  findByMember(memberId: string): Promise<Booking[]>;

  /**
   * Finds a specific booking by its unique identifier.
   *
   * @param id - The booking's unique identifier
   * @returns The booking if found, null otherwise
   */
  findById(id: string): Promise<Booking | null>;

  /**
   * Deletes a booking by its unique identifier.
   *
   * @param id - The booking's unique identifier
   */
  delete(id: string): Promise<void>;

  /**
   * Finds all confirmed bookings for a trainer on a specific date.
   * Useful for collision detection when creating new bookings.
   *
   * @param trainerId - The trainer's unique identifier
   * @param date - Date in "YYYY-MM-DD" format
   * @returns Array of confirmed bookings, sorted by start time
   */
  findConfirmedByTrainerAndDate(trainerId: string, date: string): Promise<Booking[]>;
}

/**
 * Dependency injection token for BookingRepository.
 * Use this symbol when injecting the repository in NestJS providers.
 *
 * @example
 * ```typescript
 * constructor(
 *   @Inject(BOOKING_REPOSITORY)
 *   private readonly bookingRepository: BookingRepository,
 * ) {}
 * ```
 */
export const BOOKING_REPOSITORY = Symbol('BOOKING_REPOSITORY');
