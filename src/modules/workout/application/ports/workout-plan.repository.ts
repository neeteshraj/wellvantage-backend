/**
 * @fileoverview Repository interface for workout plan persistence.
 * @module workout/application/ports/workout-plan-repository
 */

import { WorkoutPlan } from '../../domain/entities/workout-plan.entity';

/**
 * Repository interface defining the contract for workout plan persistence.
 */
export interface WorkoutPlanRepository {
  /**
   * Persists a workout plan.
   *
   * @param workoutPlan - The workout plan to save
   * @returns The saved workout plan
   */
  save(workoutPlan: WorkoutPlan): Promise<WorkoutPlan>;

  /**
   * Finds all workout plans for a trainer.
   *
   * @param trainerId - The trainer's unique identifier
   * @returns Array of workout plans, sorted by creation date (newest first)
   */
  findByTrainer(trainerId: string): Promise<WorkoutPlan[]>;

  /**
   * Finds a specific workout plan by its unique identifier.
   *
   * @param id - The workout plan's unique identifier
   * @returns The workout plan if found, null otherwise
   */
  findById(id: string): Promise<WorkoutPlan | null>;

  /**
   * Deletes a workout plan by its unique identifier.
   *
   * @param id - The workout plan's unique identifier
   */
  delete(id: string): Promise<void>;
}

/**
 * Dependency injection token for WorkoutPlanRepository.
 */
export const WORKOUT_PLAN_REPOSITORY = Symbol('WORKOUT_PLAN_REPOSITORY');
