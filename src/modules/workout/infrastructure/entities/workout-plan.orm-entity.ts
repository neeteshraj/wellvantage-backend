/**
 * @fileoverview TypeORM entity for workout_plans table.
 * @module workout/infrastructure/entities/workout-plan-orm
 */

import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { WorkoutDayOrmEntity } from './workout-day.orm-entity';

/**
 * TypeORM entity representing the workout_plans database table.
 *
 * @table workout_plans
 */
@Entity('workout_plans')
export class WorkoutPlanOrmEntity {
  /** Unique identifier for the workout plan */
  @PrimaryColumn('varchar', { length: 50 })
  id!: string;

  /** Foreign key reference to the trainer who created this plan */
  @Column('varchar', { length: 50, name: 'trainer_id' })
  @Index()
  trainerId!: string;

  /** Name of the workout plan */
  @Column('varchar', { length: 255 })
  name!: string;

  /** Optional notes for the workout plan */
  @Column('text', { nullable: true })
  notes!: string | null;

  /** Relationship to workout days */
  @OneToMany(() => WorkoutDayOrmEntity, (day) => day.workoutPlan, { cascade: true, eager: true })
  days!: WorkoutDayOrmEntity[];

  /** Timestamp when the record was created */
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  /** Timestamp when the record was last updated */
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
