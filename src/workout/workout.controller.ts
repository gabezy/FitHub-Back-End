import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { CreateWorkoutDto } from './dtos/create-workout-dto';
import { Prisma } from '@prisma/client';
import { ExerciseService } from 'src/exercise/exercise.service';

@Controller('workouts')
export class WorkoutController {
  constructor(
    private workoutService: WorkoutService,
    private exerciseService: ExerciseService,
  ) {}

  @Post()
  async postWorkout(@Body() createWorkoutDto: CreateWorkoutDto) {
    const workout = await this.workoutService.create(createWorkoutDto);
    return { workout };
  }

  @Get('/:workoutId')
  async getWorkoutById(@Param('workoutId') workoutId: string) {
    const workout = await this.workoutService.findWorkoutById(workoutId);
    return { workout };
  }

  @Get('/:workoutId/exercises')
  async getExerciseByWorkout(@Param('workoutId') workoutId: string) {
    const exercises =
      await this.exerciseService.getExercisesByWorkout(workoutId);
    return { exercises };
  }

  @Put('/:workoutId')
  async updateWorkout(
    @Param('workoutId') workoutId: string,
    @Body() data: Prisma.WorkoutUpdateInput,
  ) {
    await this.workoutService.updateWorkout(workoutId, data);
  }

  @Delete('/:workoutId')
  async deleteWorkout(@Param('workoutId') workoutId: string) {
    await this.workoutService.deleteWorkout(workoutId);
  }
}
