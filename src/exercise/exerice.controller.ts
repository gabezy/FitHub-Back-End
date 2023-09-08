import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dtos/create-exericise-dto';
import { Prisma } from '@prisma/client';

@Controller('exercises')
export class ExerciseController {
  constructor(private exerciseService: ExerciseService) {}

  @Post()
  async createExercise(@Body() createExerciseDto: CreateExerciseDto) {
    const exercise =
      await this.exerciseService.createExercise(createExerciseDto);
    return { exercise };
  }

  @Get('/:exerciseId')
  async getExerciseById(@Param('exerciseId') exerciseId: string) {
    const exercise = await this.exerciseService.getExerciseById(exerciseId);
    return { exercise };
  }

  @Put('/:exerciseId')
  async updateExercise(
    @Param('exerciseId') exerciseId: string,
    @Body() data: Prisma.ExerciseUpdateInput,
  ) {
    await this.exerciseService.updateExercise(exerciseId, data);
  }

  @Delete('/:exerciseId')
  async deleteExercise(@Param('exerciseId') exerciseId: string) {
    await this.exerciseService.deleteExercise(exerciseId);
  }
}
