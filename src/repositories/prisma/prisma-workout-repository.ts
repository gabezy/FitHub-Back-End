import { Injectable } from '@nestjs/common';
import { WorkoutRepository } from '../workout-repository';
import { PrismaService } from 'src/infra/database/prisma.service';
import { Prisma, Workout } from '@prisma/client';


@Injectable()
export class PrismaWorkoutRepository implements WorkoutRepository {
  constructor(private prismaService: PrismaService) { }

  async create(workoutName: string, userId: string): Promise<Workout> {
    const workout = await this.prismaService.workout.create({
      data: {
        user_id: userId,
        workout_name: workoutName,
      },
    });
    return workout;
  }

  async findWorkoutById(workoutId: string): Promise<Workout> {
    return await this.prismaService.workout.findUnique({
      where: { id: workoutId },
    });
  }

  async findWorkoutsByUserId(userId: string): Promise<Workout[]> {
    return await this.prismaService.workout.findMany({
      where: { user_id: userId },
    });
  }

  async updateWorkout(
    data: Prisma.WorkoutUpdateInput,
    workoutId: string,
  ): Promise<void> {
    await this.prismaService.workout.update({ data, where: { id: workoutId } });
  }

  async deleteWorkout(workoutId: string): Promise<void> {
    await this.prismaService.workout.delete({ where: { id: workoutId } });
  }
}
