/**
 * @fileoverview TypeORM implementation of the BookingRepository port.
 * @module calendar/infrastructure/repositories/typeorm-booking
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { BookingRepository } from '../../application/ports/booking.repository';
import { Booking, BookingStatus } from '../../domain/entities/booking.entity';
import { TimeRange } from '../../domain/value-objects/time-range.vo';
import { BookingOrmEntity } from '../entities/booking.orm-entity';

/**
 * TypeORM-based implementation of the BookingRepository interface.
 * Provides PostgreSQL persistence for bookings using TypeORM.
 * Implements the repository port defined in the application layer.
 *
 * @implements {BookingRepository}
 */
@Injectable()
export class TypeOrmBookingRepository implements BookingRepository {
  /**
   * Creates a new TypeOrmBookingRepository instance.
   *
   * @param ormRepository - TypeORM repository for BookingOrmEntity
   */
  constructor(
    @InjectRepository(BookingOrmEntity)
    private readonly ormRepository: Repository<BookingOrmEntity>,
  ) {}

  /**
   * Persists a booking to the database.
   *
   * @param booking - The domain booking to save
   * @returns The saved booking
   */
  async save(booking: Booking): Promise<Booking> {
    const entity = this.toOrmEntity(booking);
    await this.ormRepository.save(entity);
    return booking;
  }

  /**
   * Finds all bookings for a trainer on a specific date.
   *
   * @param trainerId - The trainer's unique identifier
   * @param date - Date in "YYYY-MM-DD" format
   * @returns Array of bookings, sorted by start time
   */
  async findByTrainerAndDate(trainerId: string, date: string): Promise<Booking[]> {
    const entities = await this.ormRepository.find({
      where: { trainerId, date },
      order: { startTime: 'ASC' },
    });
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  /**
   * Finds all bookings for a trainer within a date range.
   *
   * @param trainerId - The trainer's unique identifier
   * @param fromDate - Start date in "YYYY-MM-DD" format (inclusive)
   * @param toDate - End date in "YYYY-MM-DD" format (inclusive)
   * @returns Array of bookings, sorted by date and start time
   */
  async findByTrainerAndDateRange(trainerId: string, fromDate: string, toDate: string): Promise<Booking[]> {
    const entities = await this.ormRepository.find({
      where: {
        trainerId,
        date: Between(fromDate, toDate),
      },
      order: { date: 'ASC', startTime: 'ASC' },
    });
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  /**
   * Finds all bookings for a specific member.
   *
   * @param memberId - The member's unique identifier
   * @returns Array of bookings, sorted by date and start time
   */
  async findByMember(memberId: string): Promise<Booking[]> {
    const entities = await this.ormRepository.find({
      where: { memberId },
      order: { date: 'ASC', startTime: 'ASC' },
    });
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  /**
   * Finds a specific booking by its unique identifier.
   *
   * @param id - The booking's unique identifier
   * @returns The booking if found, null otherwise
   */
  async findById(id: string): Promise<Booking | null> {
    const entity = await this.ormRepository.findOne({ where: { id } });
    if (!entity) return null;
    return this.toDomainEntity(entity);
  }

  /**
   * Deletes a booking from the database.
   *
   * @param id - The booking's unique identifier
   */
  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  /**
   * Finds all confirmed bookings for a trainer on a specific date.
   * Used for slot availability calculation.
   *
   * @param trainerId - The trainer's unique identifier
   * @param date - Date in "YYYY-MM-DD" format
   * @returns Array of confirmed bookings, sorted by start time
   */
  async findConfirmedByTrainerAndDate(trainerId: string, date: string): Promise<Booking[]> {
    const entities = await this.ormRepository.find({
      where: { trainerId, date, status: 'confirmed' },
      order: { startTime: 'ASC' },
    });
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  /**
   * Converts a domain entity to an ORM entity for persistence.
   *
   * @param domain - The domain booking
   * @returns The ORM entity representation
   * @private
   */
  private toOrmEntity(domain: Booking): BookingOrmEntity {
    const entity = new BookingOrmEntity();
    entity.id = domain.id;
    entity.trainerId = domain.trainerId;
    entity.memberId = domain.memberId;
    entity.date = domain.date;
    entity.startTime = domain.startTime;
    entity.endTime = domain.endTime;
    entity.status = domain.status;
    entity.createdAt = domain.createdAt;
    return entity;
  }

  /**
   * Converts an ORM entity to a domain entity.
   *
   * @param orm - The ORM entity from the database
   * @returns The domain booking with reconstituted TimeRange value object
   * @private
   */
  private toDomainEntity(orm: BookingOrmEntity): Booking {
    return new Booking(
      orm.id,
      orm.trainerId,
      orm.memberId,
      orm.date,
      new TimeRange(orm.startTime, orm.endTime),
      orm.status as BookingStatus,
      orm.createdAt,
    );
  }
}
