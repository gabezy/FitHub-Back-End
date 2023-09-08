import { Injectable } from '@nestjs/common';
import { ExerciseRepository } from 'src/repositories/exercise-repository';
import { CreateExerciseDto } from './dtos/create-exericise-dto';
import { DetailsExerciseDto } from './dtos/details-exercise-dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExerciseService {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async createExercise(
    createExerciseDto: CreateExerciseDto,
  ): Promise<DetailsExerciseDto> {
    const { exercise_name, weight, reps, sets, notes, workout_id } =
      createExerciseDto;
    const exercise = await this.exerciseRepository.create({
      exerciseName: exercise_name,
      weight,
      reps,
      sets,
      notes,
      workoutId: workout_id,
    });
    return {
      id: exercise.id,
      exercise_name: exercise.exercise_name,
      weight: exercise.weight,
      reps: exercise.reps,
      sets: exercise.sets,
      notes: exercise.notes,
    };
  }

  async getExerciseById(exerciseId: string): Promise<DetailsExerciseDto> {
    const exercise = await this.exerciseRepository.getExerciseById(exerciseId);
    return {
      id: exercise.id,
      exercise_name: exercise.exercise_name,
      weight: exercise.weight,
      reps: exercise.reps,
      sets: exercise.sets,
      notes: exercise.notes,
    };
  }

  async getExercisesByWorkout(
    workoutId: string,
  ): Promise<DetailsExerciseDto[]> {
    const exercises =
      await this.exerciseRepository.getExercisesByWorkoutId(workoutId);
    const detailsExercises = exercises.map((exercise) => {
      const detailsExercise = {
        id: exercise.id,
        exercise_name: exercise.exercise_name,
        weight: exercise.weight,
        reps: exercise.reps,
        sets: exercise.sets,
        notes: exercise.notes,
      };
      return detailsExercise;
    });
    return detailsExercises;
  }

  async updateExercise(exerciseId: string, data: Prisma.ExerciseUpdateInput) {
    await this.exerciseRepository.updateExercise(exerciseId, data);
  }

  async deleteExercise(exerciseId: string) {
    await this.exerciseRepository.deleteExercise(exerciseId);
  }
}
