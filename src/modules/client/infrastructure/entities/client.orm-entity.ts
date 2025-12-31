/**
 * @fileoverview TypeORM entity for clients table.
 * @module client/infrastructure/entities/client-orm
 */

import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

/**
 * TypeORM entity representing the clients database table.
 * This is the persistence layer representation, separate from the domain entity.
 *
 * @table clients
 */
@Entity('clients')
export class ClientOrmEntity {
  /** Unique identifier for the client (UUID) */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /** ID of the trainer this client belongs to */
  @Column('uuid', { name: 'trainer_id' })
  @Index()
  trainerId!: string;

  /** Client's full name */
  @Column('varchar', { length: 255 })
  name!: string;

  /** Client's email address */
  @Column('varchar', { length: 255 })
  @Index()
  email!: string;

  /** Client's phone number */
  @Column('varchar', { length: 50, nullable: true })
  phone?: string;

  /** Total sessions in the client's package */
  @Column('int', { name: 'sessions_total', default: 0 })
  sessionsTotal!: number;

  /** Number of sessions used */
  @Column('int', { name: 'sessions_used', default: 0 })
  sessionsUsed!: number;

  /** Package expiry date */
  @Column('date', { name: 'package_expiry_date' })
  packageExpiryDate!: Date;

  /** Timestamp when the record was created */
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  /** Timestamp when the record was last updated */
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
