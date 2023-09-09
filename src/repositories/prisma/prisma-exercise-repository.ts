import { Injectable } from '@nestjs/common';
import { ExerciseParams, ExerciseRepository } from '../exercise-repository';
import { PrismaService } from 'src/infra/database/prisma.service';
import { Exercise, Prisma } from '@prisma/client';
import { ResourceNotFound } from 'src/erros/resource-not-found';

@Injectable()
export class PrismaExerciseRepository implements ExerciseRepository {
  constructor(private prismaService: PrismaService) { }

  async create(exerciseParams: ExerciseParams): Promise<Exercise> {
    const { exerciseName, weight, reps, sets, notes, workoutId } =
      exerciseParams;
    const exercise = await this.prismaService.exercise.create({
      data: {
        exercise_name: exerciseName,
        weight,
        reps,
        sets,
        notes,
        workout_id: workoutId,
      },
    });
    return exercise;
  }

  async getExerciseById(exerciseId: string): Promise<Exercise> {
    const exercise = await this.prismaService.exercise.findUnique({
      where: { id: exerciseId },
    });
    if (!exercise) {
      throw new ResourceNotFound();
    }
    return exercise;
  }

  async getExercisesByWorkoutId(workoutId: string): Promise<Exercise[]> {
    const exercises = await this.prismaService.exercise.findMany({
      where: { workout_id: workoutId },
    });
    if (!exercises) {
      throw new ResourceNotFound();
    }
    return exercises;
  }

  async updateExercise(
    exerciseId: string,
    data: Prisma.ExerciseUpdateInput,
  ): Promise<void> {
    await this.prismaService.exercise.update({
      where: { id: exerciseId },
      data,
    });
  }

  async deleteExercise(exerciseId: string): Promise<void> {
    await this.prismaService.exercise.delete({ where: { id: exerciseId } });
  }
}
