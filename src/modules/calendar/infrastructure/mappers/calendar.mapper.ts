/**
 * @fileoverview Mapper utilities for transforming between domain and persistence models.
 * @module calendar/infrastructure/mappers/calendar-mapper
 */

import { AvailabilityBlock } from '../../domain/entities/availability-block.entity';
import { Booking, BookingStatus } from '../../domain/entities/booking.entity';
import { TimeRange } from '../../domain/value-objects/time-range.vo';

/**
 * Persistence model interface for availability blocks.
 * Represents the data structure as stored in the database.
 * Decoupled from domain entity to allow schema flexibility.
 */
export interface AvailabilityBlockPersistence {
  /** Unique identifier for the availability block */
  id: string;
  /** Trainer's unique identifier */
  trainerId: string;
  /** Date in "YYYY-MM-DD" format */
  date: string;
  /** Start time in "HH:mm" format */
  startTime: string;
  /** End time in "HH:mm" format */
  endTime: string;
}

/**
 * Persistence model interface for bookings.
 * Represents the data structure as stored in the database.
 * Decoupled from domain entity to allow schema flexibility.
 */
export interface BookingPersistence {
  /** Unique identifier for the booking */
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
  status: BookingStatus;
  /** Timestamp when the booking was created */
  createdAt: Date;
}

/**
 * Static mapper class for transforming between domain entities and persistence models.
 * Provides bidirectional mapping to maintain clean architecture separation.
 * Useful when switching between different ORM/database implementations.
 *
 * @example
 * ```typescript
 * const persistence = CalendarMapper.availabilityToPersistence(domainBlock);
 * const domain = CalendarMapper.availabilityToDomain(persistenceModel);
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class CalendarMapper {
  /**
   * Maps an AvailabilityBlock domain entity to its persistence representation.
   *
   * @param entity - The domain availability block
   * @returns The persistence model suitable for database storage
   */
  static availabilityToPersistence(entity: AvailabilityBlock): AvailabilityBlockPersistence {
    return {
      id: entity.id,
      trainerId: entity.trainerId,
      date: entity.date,
      startTime: entity.startTime,
      endTime: entity.endTime,
    };
  }

  /**
   * Maps a persistence model to an AvailabilityBlock domain entity.
   *
   * @param persistence - The persistence model from the database
   * @returns The reconstituted domain availability block
   */
  static availabilityToDomain(persistence: AvailabilityBlockPersistence): AvailabilityBlock {
    return AvailabilityBlock.create(
      persistence.id,
      persistence.trainerId,
      persistence.date,
      persistence.startTime,
      persistence.endTime,
    );
  }

  /**
   * Maps a Booking domain entity to its persistence representation.
   *
   * @param entity - The domain booking
   * @returns The persistence model suitable for database storage
   */
  static bookingToPersistence(entity: Booking): BookingPersistence {
    return {
      id: entity.id,
      trainerId: entity.trainerId,
      memberId: entity.memberId,
      date: entity.date,
      startTime: entity.startTime,
      endTime: entity.endTime,
      status: entity.status,
      createdAt: entity.createdAt,
    };
  }

  /**
   * Maps a persistence model to a Booking domain entity.
   * Reconstitutes the TimeRange value object from stored start/end times.
   *
   * @param persistence - The persistence model from the database
   * @returns The reconstituted domain booking with proper value objects
   */
  static bookingToDomain(persistence: BookingPersistence): Booking {
    return new Booking(
      persistence.id,
      persistence.trainerId,
      persistence.memberId,
      persistence.date,
      new TimeRange(persistence.startTime, persistence.endTime),
      persistence.status,
      persistence.createdAt,
    );
  }
}
