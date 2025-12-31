/**
 * @fileoverview NestJS module for the calendar feature.
 * @module calendar/calendar-module
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AVAILABILITY_REPOSITORY } from './application/ports/availability.repository';
import { BOOKING_REPOSITORY } from './application/ports/booking.repository';
import { CreateBookingUseCase } from './application/usecases/create-booking.usecase';
import { ListAvailabilityUseCase } from './application/usecases/list-availability.usecase';
import { ListBookingsUseCase } from './application/usecases/list-bookings.usecase';
import { SetAvailabilityUseCase } from './application/usecases/set-availability.usecase';
import { AvailabilityBlockOrmEntity } from './infrastructure/entities/availability-block.orm-entity';
import { BookingOrmEntity } from './infrastructure/entities/booking.orm-entity';
import { TypeOrmAvailabilityRepository } from './infrastructure/repositories/typeorm-availability.repository';
import { TypeOrmBookingRepository } from './infrastructure/repositories/typeorm-booking.repository';
import { CalendarController } from './presentation/calendar.controller';

/**
 * NestJS module that wires together all calendar feature components.
 * Follows Clean Architecture principles with proper layer separation.
 *
 * Layer Structure:
 * - Presentation: CalendarController handles HTTP requests
 * - Application: Use cases contain business logic orchestration
 * - Domain: Entities and services (framework-agnostic, no NestJS dependencies)
 * - Infrastructure: TypeORM repository implementations
 *
 * Dependency Injection:
 * - Uses symbols as injection tokens for repositories
 * - Application layer depends on interfaces (ports)
 * - Infrastructure layer provides concrete implementations
 *
 * @example
 * ```typescript
 * // Import in AppModule
 * import { CalendarModule } from './modules/calendar/calendar.module';
 *
 * @Module({
 *   imports: [CalendarModule],
 * })
 * export class AppModule {}
 * ```
 */
@Module({
  imports: [TypeOrmModule.forFeature([AvailabilityBlockOrmEntity, BookingOrmEntity]), AuthModule],
  controllers: [CalendarController],
  providers: [
    SetAvailabilityUseCase,
    ListAvailabilityUseCase,
    CreateBookingUseCase,
    ListBookingsUseCase,
    {
      provide: AVAILABILITY_REPOSITORY,
      useClass: TypeOrmAvailabilityRepository,
    },
    {
      provide: BOOKING_REPOSITORY,
      useClass: TypeOrmBookingRepository,
    },
  ],
  exports: [SetAvailabilityUseCase, ListAvailabilityUseCase, CreateBookingUseCase, ListBookingsUseCase],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class CalendarModule {}
