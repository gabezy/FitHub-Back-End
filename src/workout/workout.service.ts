import { Injectable } from '@nestjs/common';
import { Workout } from '@prisma/client';
import { WorkoutRepository } from 'src/repositories/workout-repository';
import { CreateWorkoutDto } from './dtos/create-workout-dto';
import { UpdateWorkoutDto } from './dtos/update-workout-dto';

@Injectable()
export class WorkoutService {
  constructor(private workoutRepository: WorkoutRepository) { }

  async create(createWorkoutDto: CreateWorkoutDto): Promise<Workout> {
    const { workout_name, user_id } = createWorkoutDto;
    const workout = await this.workoutRepository.create(workout_name, user_id);
    return workout;
  }

  async findWorkoutById(workoutId: string): Promise<Workout> {
    return await this.workoutRepository.findWorkoutById(workoutId);
  }

  async findWorkoutsByUserId(userId: string, page: number): Promise<Workout[]> {
    const skip = page !== undefined ? (page - 1) * 10 : 0;
    return await this.workoutRepository.findWorkoutsByUserId(userId, skip);
  }

  async updateWorkout(
    workoutId: string,
    data: UpdateWorkoutDto,
  ): Promise<void> {
    await this.workoutRepository.updateWorkout(workoutId, data);
  }

  async deleteWorkout(workoutId: string): Promise<void> {
    await this.workoutRepository.deleteWorkout(workoutId);
  }
}
