/**
 * @fileoverview Use case for listing workout plans.
 * @module workout/application/usecases/list-workout-plans
 */

import { Inject, Injectable } from '@nestjs/common';
import { WorkoutPlan } from '../../domain/entities/workout-plan.entity';
import type { WorkoutPlanRepository } from '../ports/workout-plan.repository';
import { WORKOUT_PLAN_REPOSITORY } from '../ports/workout-plan.repository';

/**
 * Input DTO for the ListWorkoutPlans use case.
 */
export interface ListWorkoutPlansInput {
  trainerId: string;
}

/**
 * Output DTO for a workout plan in the list.
 */
export interface WorkoutPlanListItem {
  id: string;
  name: string;
  totalDays: number;
  totalExercises: number;
  createdAt: Date;
}

/**
 * Output DTO for the ListWorkoutPlans use case.
 */
export interface ListWorkoutPlansOutput {
  workoutPlans: WorkoutPlanListItem[];
}

/**
 * Use case for listing workout plans for a trainer.
 */
@Injectable()
export class ListWorkoutPlansUseCase {
  constructor(
    @Inject(WORKOUT_PLAN_REPOSITORY)
    private readonly workoutPlanRepository: WorkoutPlanRepository,
  ) {}

  /**
   * Executes the use case to list workout plans.
   */
  async execute(input: ListWorkoutPlansInput): Promise<ListWorkoutPlansOutput> {
    const plans = await this.workoutPlanRepository.findByTrainer(input.trainerId);

    return {
      workoutPlans: plans.map((plan) => this.toListItem(plan)),
    };
  }

  private toListItem(plan: WorkoutPlan): WorkoutPlanListItem {
    return {
      id: plan.id,
      name: plan.name,
      totalDays: plan.totalDays,
      totalExercises: plan.totalExercises,
      createdAt: plan.createdAt,
    };
  }
}
