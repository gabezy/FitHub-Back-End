import { Workout } from '@prisma/client';
import { UpdateWorkoutDto } from 'src/workout/dtos/update-workout-dto';

export abstract class WorkoutRepository {
  abstract create(workoutName: string, userId: string): Promise<Workout>;
  abstract findWorkoutById(workoutId: string): Promise<Workout>;
  abstract findWorkoutsByUserId(userId: string, page: number): Promise<Workout[]>;
  abstract updateWorkout(
    workoutId: string,
    data: UpdateWorkoutDto,
  ): Promise<void>;
  abstract deleteWorkout(workoutId: string): Promise<void>;
}
