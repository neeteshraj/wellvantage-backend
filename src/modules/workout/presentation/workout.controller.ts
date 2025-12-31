/**
 * @fileoverview HTTP controller for workout module endpoints.
 * @module workout/presentation/workout-controller
 */

import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard';
import { CreateWorkoutPlanUseCase } from '../application/usecases/create-workout-plan.usecase';
import { DeleteWorkoutPlanUseCase } from '../application/usecases/delete-workout-plan.usecase';
import { ListWorkoutPlansUseCase } from '../application/usecases/list-workout-plans.usecase';
import { CreateWorkoutPlanDto } from './dto/create-workout-plan.dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

/**
 * REST controller handling workout-related HTTP requests.
 * All routes are protected by JWT authentication.
 * The trainerId is automatically extracted from the authenticated user.
 *
 * @route /workout
 */
@Controller('workout')
@UseGuards(JwtAuthGuard)
export class WorkoutController {
  constructor(
    private readonly createWorkoutPlanUseCase: CreateWorkoutPlanUseCase,
    private readonly listWorkoutPlansUseCase: ListWorkoutPlansUseCase,
    private readonly deleteWorkoutPlanUseCase: DeleteWorkoutPlanUseCase,
  ) {}

  /**
   * Creates a new workout plan for the authenticated user.
   *
   * @route POST /workout/plans
   * @param req - The authenticated request containing user info
   * @param dto - The workout plan creation data
   * @returns Success response with created workout plan
   */
  @Post('plans')
  @HttpCode(HttpStatus.CREATED)
  async createWorkoutPlan(@Req() req: AuthenticatedRequest, @Body() dto: CreateWorkoutPlanDto) {
    const result = await this.createWorkoutPlanUseCase.execute({
      trainerId: req.user.id,
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
      notes: dto.notes ?? '',
    });

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Retrieves all workout plans for the authenticated user.
   *
   * @route GET /workout/plans
   * @param req - The authenticated request containing user info
   * @returns Success response with list of workout plans
   */
  @Get('plans')
  async getWorkoutPlans(@Req() req: AuthenticatedRequest) {
    const result = await this.listWorkoutPlansUseCase.execute({
      trainerId: req.user.id,
    });

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Deletes a workout plan owned by the authenticated user.
   *
   * @route DELETE /workout/plans/:id
   * @param req - The authenticated request containing user info
   * @param id - The workout plan ID
   * @returns Success response
   */
  @Delete('plans/:id')
  @HttpCode(HttpStatus.OK)
  async deleteWorkoutPlan(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    await this.deleteWorkoutPlanUseCase.execute({
      id,
      trainerId: req.user.id,
    });

    return {
      success: true,
      message: 'Workout plan deleted successfully',
    };
  }
}
