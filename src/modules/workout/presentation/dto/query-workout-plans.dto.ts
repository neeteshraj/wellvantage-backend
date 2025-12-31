/**
 * @fileoverview DTOs for querying workout plans.
 * @module workout/presentation/dto/query-workout-plans
 */

import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO for querying workout plans by trainer.
 */
export class QueryWorkoutPlansDto {
  @IsString()
  @IsNotEmpty()
  trainerId!: string;
}

/**
 * DTO for deleting a workout plan.
 */
export class DeleteWorkoutPlanDto {
  @IsString()
  @IsNotEmpty()
  trainerId!: string;
}
