import { Prisma, Workout } from '@prisma/client';

export abstract class WorkoutRepository {
  abstract create(workoutName: string, userId: string): Promise<Workout>;
  abstract findWorkoutById(workoutId: string): Promise<Workout>;
  abstract findWorkoutsByUserId(userId: string): Promise<Workout[]>;
  abstract updateWorkout(
    data: Prisma.WorkoutUpdateInput,
    workoutId: string,
  ): Promise<void>;
  abstract deleteWorkout(workoutId: string): Promise<void>;
}
