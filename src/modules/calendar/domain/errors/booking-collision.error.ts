/**
 * @fileoverview Custom error for booking collision scenarios.
 * @module calendar/domain/errors/booking-collision
 */

/**
 * Error thrown when a booking request conflicts with existing bookings
 * or falls outside of trainer availability.
 *
 * @extends Error
 *
 * @example
 * ```typescript
 * throw BookingCollisionError.overlap('trainer_123', '2024-01-15', '10:00', '11:00', 'book_456');
 * ```
 */
export class BookingCollisionError extends Error {
  /**
   * Creates a new BookingCollisionError instance.
   *
   * @param message - Human-readable error message
   * @param conflictingBookingId - Optional ID of the booking that caused the collision
   */
  constructor(
    message: string,
    public readonly conflictingBookingId?: string,
  ) {
    super(message);
    this.name = 'BookingCollisionError';
    Error.captureStackTrace(this, BookingCollisionError);
  }

  /**
   * Creates an error for when a booking overlaps with an existing booking.
   *
   * @param trainerId - ID of the trainer
   * @param date - Date of the attempted booking
   * @param startTime - Requested start time
   * @param endTime - Requested end time
   * @param conflictingBookingId - ID of the existing booking that conflicts
   * @returns BookingCollisionError instance
   */
  static overlap(
    trainerId: string,
    date: string,
    startTime: string,
    endTime: string,
    conflictingBookingId: string,
  ): BookingCollisionError {
    return new BookingCollisionError(
      `Booking collision: Trainer ${trainerId} already has a booking on ${date} ` +
        `that overlaps with ${startTime}-${endTime}`,
      conflictingBookingId,
    );
  }

  /**
   * Creates an error for when a booking falls outside trainer availability.
   *
   * @param trainerId - ID of the trainer
   * @param date - Date of the attempted booking
   * @param startTime - Requested start time
   * @param endTime - Requested end time
   * @returns BookingCollisionError instance
   */
  static outsideAvailability(
    trainerId: string,
    date: string,
    startTime: string,
    endTime: string,
  ): BookingCollisionError {
    return new BookingCollisionError(
      `Booking not allowed: Trainer ${trainerId} is not available on ${date} ` +
        `during ${startTime}-${endTime}. Booking must be within an availability block.`,
    );
  }
}
