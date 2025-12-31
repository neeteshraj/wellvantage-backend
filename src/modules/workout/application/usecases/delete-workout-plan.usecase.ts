/**
 * @fileoverview Use case for deleting workout plans.
 * @module workout/application/usecases/delete-workout-plan
 */

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { WorkoutPlanRepository } from '../ports/workout-plan.repository';
import { WORKOUT_PLAN_REPOSITORY } from '../ports/workout-plan.repository';

/**
 * Input DTO for the DeleteWorkoutPlan use case.
 */
export interface DeleteWorkoutPlanInput {
  id: string;
  trainerId: string;
}

/**
 * Use case for deleting a workout plan.
 */
@Injectable()
export class DeleteWorkoutPlanUseCase {
  constructor(
    @Inject(WORKOUT_PLAN_REPOSITORY)
    private readonly workoutPlanRepository: WorkoutPlanRepository,
  ) {}

  /**
   * Executes the use case to delete a workout plan.
   */
  async execute(input: DeleteWorkoutPlanInput): Promise<void> {
    const plan = await this.workoutPlanRepository.findById(input.id);

    if (!plan) {
      throw new NotFoundException(`Workout plan with id ${input.id} not found`);
    }

    // Verify ownership
    if (plan.trainerId !== input.trainerId) {
      throw new NotFoundException(`Workout plan with id ${input.id} not found`);
    }

    await this.workoutPlanRepository.delete(input.id);
  }
}
