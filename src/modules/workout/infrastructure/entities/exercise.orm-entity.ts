/**
 * @fileoverview TypeORM entity for exercises table.
 * @module workout/infrastructure/entities/exercise-orm
 */

import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { WorkoutDayOrmEntity } from './workout-day.orm-entity';

/**
 * TypeORM entity representing the exercises database table.
 *
 * @table exercises
 */
@Entity('exercises')
export class ExerciseOrmEntity {
  /** Unique identifier for the exercise */
  @PrimaryColumn('varchar', { length: 50 })
  id!: string;

  /** Foreign key reference to the workout day */
  @Column('varchar', { length: 50, name: 'workout_day_id' })
  @Index()
  workoutDayId!: string;

  /** Name of the exercise */
  @Column('varchar', { length: 255 })
  name!: string;

  /** Number of sets */
  @Column('varchar', { length: 50 })
  sets!: string;

  /** Number of reps */
  @Column('varchar', { length: 50 })
  reps!: string;

  /** Relationship to workout day */
  @ManyToOne(() => WorkoutDayOrmEntity, (day) => day.exercises, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workout_day_id' })
  workoutDay!: WorkoutDayOrmEntity;
}
