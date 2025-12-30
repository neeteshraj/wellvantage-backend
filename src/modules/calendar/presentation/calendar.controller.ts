/**
 * @fileoverview HTTP controller for calendar module endpoints.
 * @module calendar/presentation/calendar-controller
 */

import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Query } from '@nestjs/common';
import { BookingCollisionError } from '../domain/errors/booking-collision.error';
import { CreateBookingUseCase } from '../application/usecases/create-booking.usecase';
import { ListAvailabilityUseCase } from '../application/usecases/list-availability.usecase';
import { ListBookingsUseCase } from '../application/usecases/list-bookings.usecase';
import { SetAvailabilityUseCase } from '../application/usecases/set-availability.usecase';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QueryAvailabilityDto, QueryBookingsDto } from './dto/query-availability.dto';

/**
 * REST controller handling calendar-related HTTP requests.
 * Delegates business logic to application layer use cases.
 * Maps domain errors to appropriate HTTP responses.
 *
 * @route /calendar
 */
@Controller('calendar')
export class CalendarController {
  /**
   * Creates a new CalendarController instance.
   *
   * @param setAvailabilityUseCase - Use case for creating availability blocks
   * @param listAvailabilityUseCase - Use case for retrieving availability and slots
   * @param createBookingUseCase - Use case for creating bookings
   * @param listBookingsUseCase - Use case for listing bookings
   */
  constructor(
    private readonly setAvailabilityUseCase: SetAvailabilityUseCase,
    private readonly listAvailabilityUseCase: ListAvailabilityUseCase,
    private readonly createBookingUseCase: CreateBookingUseCase,
    private readonly listBookingsUseCase: ListBookingsUseCase,
  ) {}

  /**
   * Creates an availability block for a trainer.
   *
   * @route POST /calendar/availability
   * @param dto - The availability block creation data
   * @returns Success response with created availability block
   *
   * @example
   * POST /calendar/availability
   * {
   *   "trainerId": "trainer_123",
   *   "date": "2024-01-15",
   *   "startTime": "09:00",
   *   "endTime": "17:00"
   * }
   */
  @Post('availability')
  @HttpCode(HttpStatus.CREATED)
  async createAvailability(@Body() dto: CreateAvailabilityDto) {
    const result = await this.setAvailabilityUseCase.execute({
      trainerId: dto.trainerId,
      date: dto.date,
      startTime: dto.startTime,
      endTime: dto.endTime,
    });

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Retrieves availability blocks and generated time slots for a trainer on a specific date.
   *
   * @route GET /calendar/availability
   * @param query - Query parameters with trainerId and date
   * @returns Success response with availability blocks and slots
   *
   * @example
   * GET /calendar/availability?trainerId=trainer_123&date=2024-01-15
   */
  @Get('availability')
  async getAvailability(@Query() query: QueryAvailabilityDto) {
    const result = await this.listAvailabilityUseCase.execute({
      trainerId: query.trainerId,
      date: query.date,
    });

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Creates a booking for a trainer.
   * Returns 409 Conflict if the requested time slot overlaps with an existing booking.
   *
   * @route POST /calendar/book
   * @param dto - The booking creation data
   * @returns Success response with created booking
   * @throws {HttpException} 409 Conflict if booking collision occurs
   *
   * @example
   * POST /calendar/book
   * {
   *   "trainerId": "trainer_123",
   *   "memberId": "member_456",
   *   "date": "2024-01-15",
   *   "startTime": "10:00",
   *   "endTime": "10:30"
   * }
   */
  @Post('book')
  @HttpCode(HttpStatus.CREATED)
  async createBooking(@Body() dto: CreateBookingDto) {
    try {
      const result = await this.createBookingUseCase.execute({
        trainerId: dto.trainerId,
        memberId: dto.memberId,
        date: dto.date,
        startTime: dto.startTime,
        endTime: dto.endTime,
      });

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      if (error instanceof BookingCollisionError) {
        throw new HttpException(
          {
            success: false,
            error: {
              code: 'BOOKING_COLLISION',
              message: error.message,
              conflictingBookingId: error.conflictingBookingId,
            },
          },
          HttpStatus.CONFLICT,
        );
      }

      throw error;
    }
  }

  /**
   * Retrieves bookings for a trainer within a date range.
   *
   * @route GET /calendar/bookings
   * @param query - Query parameters with trainerId, from date, and to date
   * @returns Success response with list of bookings
   *
   * @example
   * GET /calendar/bookings?trainerId=trainer_123&from=2024-01-01&to=2024-01-31
   */
  @Get('bookings')
  async getBookings(@Query() query: QueryBookingsDto) {
    const result = await this.listBookingsUseCase.execute({
      trainerId: query.trainerId,
      fromDate: query.from,
      toDate: query.to,
    });

    return {
      success: true,
      data: result,
    };
  }
}
