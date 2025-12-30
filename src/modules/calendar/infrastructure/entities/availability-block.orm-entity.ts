/**
 * @fileoverview TypeORM entity for availability blocks table.
 * @module calendar/infrastructure/entities/availability-block-orm
 */

import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

/**
 * TypeORM entity representing the availability_blocks database table.
 * This is the persistence layer representation, separate from the domain entity.
 *
 * @table availability_blocks
 */
@Entity('availability_blocks')
@Index(['trainerId', 'date'])
export class AvailabilityBlockOrmEntity {
  /** Unique identifier for the availability block */
  @PrimaryColumn('varchar', { length: 50 })
  id!: string;

  /** Foreign key reference to the trainer */
  @Column('varchar', { length: 50, name: 'trainer_id' })
  @Index()
  trainerId!: string;

  /** Date of the availability block */
  @Column('date')
  @Index()
  date!: string;

  /** Start time of availability */
  @Column('time', { name: 'start_time' })
  startTime!: string;

  /** End time of availability */
  @Column('time', { name: 'end_time' })
  endTime!: string;

  /** Timestamp when the record was created */
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  /** Timestamp when the record was last updated */
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
