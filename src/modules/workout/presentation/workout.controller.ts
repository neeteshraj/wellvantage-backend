/**
 * @fileoverview HTTP controller for workout module endpoints.
 * @module workout/presentation/workout-controller
 */

import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { CreateWorkoutPlanUseCase } from '../application/usecases/create-workout-plan.usecase';
import { DeleteWorkoutPlanUseCase } from '../application/usecases/delete-workout-plan.usecase';
import { ListWorkoutPlansUseCase } from '../application/usecases/list-workout-plans.usecase';
import { CreateWorkoutPlanDto } from './dto/create-workout-plan.dto';
import { DeleteWorkoutPlanDto, QueryWorkoutPlansDto } from './dto/query-workout-plans.dto';

/**
 * REST controller handling workout-related HTTP requests.
 *
 * @route /workout
 */
@Controller('workout')
export class WorkoutController {
  constructor(
    private readonly createWorkoutPlanUseCase: CreateWorkoutPlanUseCase,
    private readonly listWorkoutPlansUseCase: ListWorkoutPlansUseCase,
    private readonly deleteWorkoutPlanUseCase: DeleteWorkoutPlanUseCase,
  ) {}

  /**
   * Creates a new workout plan.
   *
   * @route POST /workout/plans
   * @param dto - The workout plan creation data
   * @returns Success response with created workout plan
   */
  @Post('plans')
  @HttpCode(HttpStatus.CREATED)
  async createWorkoutPlan(@Body() dto: CreateWorkoutPlanDto) {
    const result = await this.createWorkoutPlanUseCase.execute({
      trainerId: dto.trainerId,
      name: dto.name,
      days: dto.days.map((day) => ({
        dayNumber: day.dayNumber,
        bodyPart: day.bodyPart,
        exercises: day.exercises.map((ex) => ({
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
        })),
      })),
      notes: dto.notes || '',
    });

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Retrieves all workout plans for a trainer.
   *
   * @route GET /workout/plans
   * @param query - Query parameters with trainerId
   * @returns Success response with list of workout plans
   */
  @Get('plans')
  async getWorkoutPlans(@Query() query: QueryWorkoutPlansDto) {
    const result = await this.listWorkoutPlansUseCase.execute({
      trainerId: query.trainerId,
    });

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Deletes a workout plan.
   *
   * @route DELETE /workout/plans/:id
   * @param id - The workout plan ID
   * @param query - Query parameters with trainerId for ownership verification
   * @returns Success response
   */
  @Delete('plans/:id')
  @HttpCode(HttpStatus.OK)
  async deleteWorkoutPlan(@Param('id') id: string, @Query() query: DeleteWorkoutPlanDto) {
    await this.deleteWorkoutPlanUseCase.execute({
      id,
      trainerId: query.trainerId,
    });

    return {
      success: true,
      message: 'Workout plan deleted successfully',
    };
  }
}
