import { Injectable } from '@nestjs/common';
import { Prisma, Workout } from '@prisma/client';
import { WorkoutRepository } from 'src/repositories/workout-repository';
import { CreateWorkoutDto } from './dtos/create-workout-dto';

@Injectable()
export class WorkoutService {
  constructor(private workoutRepository: WorkoutRepository) {}

  async create(createWorkoutDto: CreateWorkoutDto): Promise<Workout> {
    const { workout_name, user_id } = createWorkoutDto;
    const workout = await this.workoutRepository.create(workout_name, user_id);
    return workout;
  }

  async findWorkoutById(workoutId: string): Promise<Workout> {
    return await this.workoutRepository.findWorkoutById(workoutId);
  }

  async findWorkoutsByUserId(userId: string): Promise<Workout[]> {
    return await this.workoutRepository.findWorkoutsByUserId(userId);
  }

  async updateWorkout(
    workoutId: string,
    data: Prisma.WorkoutUpdateInput,
  ): Promise<void> {
    await this.workoutRepository.updateWorkout(data, workoutId);
  }

  async deleteWorkout(workoutId: string): Promise<void> {
    await this.workoutRepository.deleteWorkout(workoutId);
  }
}
