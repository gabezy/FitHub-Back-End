import { Exercise, Prisma } from '@prisma/client';

export type ExerciseParams = {
  exerciseName: string;
  weight: number;
  reps: number;
  sets: number;
  notes?: string;
  workoutId: string;
};

export abstract class ExerciseRepository {
  abstract create(exerciseParams: ExerciseParams): Promise<Exercise>;
  abstract getExerciseById(exerciseId: string): Promise<Exercise>;
  abstract getExercisesByWorkoutId(workoutId: string): Promise<Exercise[]>;
  abstract updateExercise(
    exerciseId: string,
    data: Prisma.ExerciseUpdateInput,
  ): Promise<void>;
  abstract deleteExercise(exerciseId: string): Promise<void>;
}
