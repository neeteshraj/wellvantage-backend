/**
 * @fileoverview TypeORM entity for bookings table.
 * @module calendar/infrastructure/entities/booking-orm
 */

import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

/**
 * TypeORM entity representing the bookings database table.
 * This is the persistence layer representation, separate from the domain entity.
 *
 * @table bookings
 */
@Entity('bookings')
@Index(['trainerId', 'date'])
export class BookingOrmEntity {
  /** Unique identifier for the booking */
  @PrimaryColumn('varchar', { length: 50 })
  id!: string;

  /** Foreign key reference to the trainer */
  @Column('varchar', { length: 50, name: 'trainer_id' })
  @Index()
  trainerId!: string;

  /** Foreign key reference to the member who made the booking */
  @Column('varchar', { length: 50, name: 'member_id' })
  @Index()
  memberId!: string;

  /** Date of the booking */
  @Column('date')
  @Index()
  date!: string;

  /** Start time of the booking */
  @Column('time', { name: 'start_time' })
  startTime!: string;

  /** End time of the booking */
  @Column('time', { name: 'end_time' })
  endTime!: string;

  /** Booking status (confirmed/cancelled) */
  @Column('varchar', { length: 20, default: 'confirmed' })
  status!: string;

  /** Timestamp when the record was created */
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  /** Timestamp when the record was last updated */
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
