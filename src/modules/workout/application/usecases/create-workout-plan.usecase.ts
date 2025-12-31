/**
 * @fileoverview Use case for creating workout plans.
 * @module workout/application/usecases/create-workout-plan
 */

import { Inject, Injectable } from '@nestjs/common';
import { Exercise, WorkoutDay, WorkoutPlan } from '../../domain/entities/workout-plan.entity';
import type { WorkoutPlanRepository } from '../ports/workout-plan.repository';
import { WORKOUT_PLAN_REPOSITORY } from '../ports/workout-plan.repository';

/**
 * Input DTO for exercise creation.
 */
export interface ExerciseInput {
  name: string;
  sets: string;
  reps: string;
}

/**
 * Input DTO for day creation.
 */
export interface DayInput {
  dayNumber: number;
  bodyPart: string;
  exercises: ExerciseInput[];
}

/**
 * Input DTO for the CreateWorkoutPlan use case.
 */
export interface CreateWorkoutPlanInput {
  trainerId: string;
  name: string;
  days: DayInput[];
  notes: string;
}

/**
 * Output DTO for exercise.
 */
export interface ExerciseOutput {
  id: string;
  name: string;
  sets: string;
  reps: string;
}

/**
 * Output DTO for day.
 */
export interface DayOutput {
  id: string;
  dayNumber: number;
  bodyPart: string;
  exercises: ExerciseOutput[];
}

/**
 * Output DTO for the CreateWorkoutPlan use case.
 */
export interface CreateWorkoutPlanOutput {
  id: string;
  trainerId: string;
  name: string;
  days: DayOutput[];
  notes: string;
  createdAt: Date;
}

/**
 * Use case for creating a new workout plan.
 */
@Injectable()
export class CreateWorkoutPlanUseCase {
  constructor(
    @Inject(WORKOUT_PLAN_REPOSITORY)
    private readonly workoutPlanRepository: WorkoutPlanRepository,
  ) {}

  /**
   * Executes the use case to create a new workout plan.
   */
  async execute(input: CreateWorkoutPlanInput): Promise<CreateWorkoutPlanOutput> {
    const planId = this.generateId('plan');

    const days = input.days.map((dayInput) => {
      const dayId = this.generateId('day');
      const exercises = dayInput.exercises.map((exInput) =>
        Exercise.create(this.generateId('ex'), exInput.name, exInput.sets, exInput.reps),
      );
      return WorkoutDay.create(dayId, dayInput.dayNumber, dayInput.bodyPart, exercises);
    });

    const workoutPlan = WorkoutPlan.create(planId, input.trainerId, input.name, days, input.notes);

    const savedPlan = await this.workoutPlanRepository.save(workoutPlan);

    return this.toOutput(savedPlan);
  }

  private generateId(prefix: string): string {
    return `${prefix}_${String(Date.now())}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private toOutput(plan: WorkoutPlan): CreateWorkoutPlanOutput {
    return {
      id: plan.id,
      trainerId: plan.trainerId,
      name: plan.name,
      days: plan.days.map((day) => ({
        id: day.id,
        dayNumber: day.dayNumber,
        bodyPart: day.bodyPart,
        exercises: day.exercises.map((ex) => ({
          id: ex.id,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
        })),
      })),
      notes: plan.notes,
      createdAt: plan.createdAt,
    };
  }
}
