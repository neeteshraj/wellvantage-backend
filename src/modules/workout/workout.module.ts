/**
 * @fileoverview NestJS module for the workout feature.
 * @module workout/workout-module
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WORKOUT_PLAN_REPOSITORY } from './application/ports/workout-plan.repository';
import { CreateWorkoutPlanUseCase } from './application/usecases/create-workout-plan.usecase';
import { DeleteWorkoutPlanUseCase } from './application/usecases/delete-workout-plan.usecase';
import { ListWorkoutPlansUseCase } from './application/usecases/list-workout-plans.usecase';
import { ExerciseOrmEntity } from './infrastructure/entities/exercise.orm-entity';
import { WorkoutDayOrmEntity } from './infrastructure/entities/workout-day.orm-entity';
import { WorkoutPlanOrmEntity } from './infrastructure/entities/workout-plan.orm-entity';
import { TypeOrmWorkoutPlanRepository } from './infrastructure/repositories/typeorm-workout-plan.repository';
import { WorkoutController } from './presentation/workout.controller';

/**
 * NestJS module that wires together all workout feature components.
 */
@Module({
  imports: [TypeOrmModule.forFeature([WorkoutPlanOrmEntity, WorkoutDayOrmEntity, ExerciseOrmEntity])],
  controllers: [WorkoutController],
  providers: [
    CreateWorkoutPlanUseCase,
    ListWorkoutPlansUseCase,
    DeleteWorkoutPlanUseCase,
    {
      provide: WORKOUT_PLAN_REPOSITORY,
      useClass: TypeOrmWorkoutPlanRepository,
    },
  ],
  exports: [CreateWorkoutPlanUseCase, ListWorkoutPlansUseCase, DeleteWorkoutPlanUseCase],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class WorkoutModule {}
