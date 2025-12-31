/**
 * @fileoverview TypeORM entity for workout_days table.
 * @module workout/infrastructure/entities/workout-day-orm
 */

import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { WorkoutPlanOrmEntity } from './workout-plan.orm-entity';
import { ExerciseOrmEntity } from './exercise.orm-entity';
/**
 * TypeORM entity representing the workout_days database table.
 *
 * @table workout_days
 */
@Entity('workout_days')
export class WorkoutDayOrmEntity {
  /** Unique identifier for the workout day */
  @PrimaryColumn('varchar', { length: 50 })
  id!: string;

  /** Foreign key reference to the workout plan */
  @Column('varchar', { length: 50, name: 'workout_plan_id' })
  @Index()
  workoutPlanId!: string;

  /** Day number within the workout plan */
  @Column('int', { name: 'day_number' })
  dayNumber!: number;

  /** Body part focus for this day */
  @Column('varchar', { length: 100, name: 'body_part' })
  bodyPart!: string;

  /** Relationship to workout plan */
  @ManyToOne(() => WorkoutPlanOrmEntity, (plan) => plan.days, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workout_plan_id' })
  workoutPlan!: WorkoutPlanOrmEntity;

  /** Relationship to exercises */
  @OneToMany(() => ExerciseOrmEntity, (exercise) => exercise.workoutDay, { cascade: true, eager: true })
  exercises!: ExerciseOrmEntity[];
}
