/**
 * @fileoverview Workout plan domain entities.
 * @module workout/domain/entities/workout-plan
 */

/**
 * Domain entity representing an exercise within a workout day.
 */
export class Exercise {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly sets: string,
    public readonly reps: string,
  ) {}

  static create(id: string, name: string, sets: string, reps: string): Exercise {
    return new Exercise(id, name, sets, reps);
  }
}

/**
 * Domain entity representing a day within a workout plan.
 */
export class WorkoutDay {
  constructor(
    public readonly id: string,
    public readonly dayNumber: number,
    public readonly bodyPart: string,
    public readonly exercises: Exercise[],
  ) {}

  static create(id: string, dayNumber: number, bodyPart: string, exercises: Exercise[]): WorkoutDay {
    return new WorkoutDay(id, dayNumber, bodyPart, exercises);
  }
}

/**
 * Domain entity representing a workout plan created by a trainer.
 */
export class WorkoutPlan {
  constructor(
    public readonly id: string,
    public readonly trainerId: string,
    public readonly name: string,
    public readonly days: WorkoutDay[],
    public readonly notes: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  /**
   * Factory method to create a new WorkoutPlan.
   */
  static create(id: string, trainerId: string, name: string, days: WorkoutDay[], notes: string): WorkoutPlan {
    const now = new Date();
    return new WorkoutPlan(id, trainerId, name, days, notes, now, now);
  }

  /**
   * Gets the total number of days in this workout plan.
   */
  get totalDays(): number {
    return this.days.length;
  }

  /**
   * Gets the total number of exercises across all days.
   */
  get totalExercises(): number {
    return this.days.reduce((total, day) => total + day.exercises.length, 0);
  }
}
