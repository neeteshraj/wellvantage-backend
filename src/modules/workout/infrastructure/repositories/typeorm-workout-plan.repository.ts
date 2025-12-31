/**
 * @fileoverview TypeORM implementation of the WorkoutPlanRepository port.
 * @module workout/infrastructure/repositories/typeorm-workout-plan
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkoutPlanRepository } from '../../application/ports/workout-plan.repository';
import { Exercise, WorkoutDay, WorkoutPlan } from '../../domain/entities/workout-plan.entity';
import { ExerciseOrmEntity } from '../entities/exercise.orm-entity';
import { WorkoutDayOrmEntity } from '../entities/workout-day.orm-entity';
import { WorkoutPlanOrmEntity } from '../entities/workout-plan.orm-entity';

/**
 * TypeORM-based implementation of the WorkoutPlanRepository interface.
 */
@Injectable()
export class TypeOrmWorkoutPlanRepository implements WorkoutPlanRepository {
  constructor(
    @InjectRepository(WorkoutPlanOrmEntity)
    private readonly planRepository: Repository<WorkoutPlanOrmEntity>,
    @InjectRepository(WorkoutDayOrmEntity)
    private readonly dayRepository: Repository<WorkoutDayOrmEntity>,
    @InjectRepository(ExerciseOrmEntity)
    private readonly exerciseRepository: Repository<ExerciseOrmEntity>,
  ) {}

  /**
   * Persists a workout plan to the database with all related days and exercises.
   */
  async save(workoutPlan: WorkoutPlan): Promise<WorkoutPlan> {
    const planEntity = this.toPlanOrmEntity(workoutPlan);

    // Save the plan first
    await this.planRepository.save(planEntity);

    // Save days and exercises
    for (const day of workoutPlan.days) {
      const dayEntity = this.toDayOrmEntity(day, workoutPlan.id);
      await this.dayRepository.save(dayEntity);

      for (const exercise of day.exercises) {
        const exerciseEntity = this.toExerciseOrmEntity(exercise, day.id);
        await this.exerciseRepository.save(exerciseEntity);
      }
    }

    return workoutPlan;
  }

  /**
   * Finds all workout plans for a trainer.
   */
  async findByTrainer(trainerId: string): Promise<WorkoutPlan[]> {
    const entities = await this.planRepository.find({
      where: { trainerId },
      order: { createdAt: 'DESC' },
      relations: ['days', 'days.exercises'],
    });

    return entities.map((entity) => this.toDomainEntity(entity));
  }

  /**
   * Finds a specific workout plan by its unique identifier.
   */
  async findById(id: string): Promise<WorkoutPlan | null> {
    const entity = await this.planRepository.findOne({
      where: { id },
      relations: ['days', 'days.exercises'],
    });

    if (!entity) return null;
    return this.toDomainEntity(entity);
  }

  /**
   * Deletes a workout plan and all related data.
   */
  async delete(id: string): Promise<void> {
    await this.planRepository.delete(id);
  }

  private toPlanOrmEntity(domain: WorkoutPlan): WorkoutPlanOrmEntity {
    const entity = new WorkoutPlanOrmEntity();
    entity.id = domain.id;
    entity.trainerId = domain.trainerId;
    entity.name = domain.name;
    entity.notes = domain.notes;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }

  private toDayOrmEntity(domain: WorkoutDay, workoutPlanId: string): WorkoutDayOrmEntity {
    const entity = new WorkoutDayOrmEntity();
    entity.id = domain.id;
    entity.workoutPlanId = workoutPlanId;
    entity.dayNumber = domain.dayNumber;
    entity.bodyPart = domain.bodyPart;
    return entity;
  }

  private toExerciseOrmEntity(domain: Exercise, workoutDayId: string): ExerciseOrmEntity {
    const entity = new ExerciseOrmEntity();
    entity.id = domain.id;
    entity.workoutDayId = workoutDayId;
    entity.name = domain.name;
    entity.sets = domain.sets;
    entity.reps = domain.reps;
    return entity;
  }

  private toDomainEntity(orm: WorkoutPlanOrmEntity): WorkoutPlan {
    const days = orm.days
      .sort((a, b) => a.dayNumber - b.dayNumber)
      .map((dayOrm) => {
        const exercises = dayOrm.exercises.map((exOrm) => new Exercise(exOrm.id, exOrm.name, exOrm.sets, exOrm.reps));
        return new WorkoutDay(dayOrm.id, dayOrm.dayNumber, dayOrm.bodyPart, exercises);
      });

    return new WorkoutPlan(orm.id, orm.trainerId, orm.name, days, orm.notes ?? '', orm.createdAt, orm.updatedAt);
  }
}
