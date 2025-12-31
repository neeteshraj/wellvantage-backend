/**
 * @fileoverview DTOs for creating workout plans.
 * @module workout/presentation/dto/create-workout-plan
 */

import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for exercise input.
 */
export class ExerciseDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  sets!: string;

  @IsString()
  @IsNotEmpty()
  reps!: string;
}

/**
 * DTO for day input.
 */
export class DayDto {
  @IsNumber()
  dayNumber!: number;

  @IsString()
  @IsNotEmpty()
  bodyPart!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseDto)
  exercises!: ExerciseDto[];
}

/**
 * DTO for creating a workout plan.
 * Note: trainerId is extracted from the authenticated user, not from the request body.
 */
export class CreateWorkoutPlanDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DayDto)
  days!: DayDto[];

  @IsString()
  @IsOptional()
  notes?: string;
}
