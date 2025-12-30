/**
 * @fileoverview TypeORM entity for users table.
 * @module auth/infrastructure/entities/user-orm
 */

import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

/**
 * TypeORM entity representing the users database table.
 * This is the persistence layer representation, separate from the domain entity.
 *
 * @table users
 */
@Entity('users')
export class UserOrmEntity {
  /** Unique identifier for the user (UUID) */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /** User's email address */
  @Column('varchar', { length: 255, unique: true })
  @Index()
  email!: string;

  /** User's display name */
  @Column('varchar', { length: 255 })
  name!: string;

  /** User's avatar URL from Google */
  @Column('varchar', { length: 500, nullable: true })
  avatar?: string;

  /** Google OAuth ID */
  @Column('varchar', { length: 255, unique: true, name: 'google_id' })
  @Index()
  googleId!: string;

  /** Timestamp when the record was created */
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  /** Timestamp when the record was last updated */
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
