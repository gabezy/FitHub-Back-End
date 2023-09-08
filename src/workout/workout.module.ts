import { Module } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { PrismaService } from 'src/infra/database/prisma.service';
import { WorkoutRepository } from 'src/repositories/workout-repository';
import { PrismaWorkoutRepository } from 'src/repositories/prisma/prisma-workout-repository';
import { WorkoutController } from './workout.controller';
import { ExerciseModule } from 'src/exercise/exercise.module';

@Module({
  imports: [ExerciseModule],
  controllers: [WorkoutController],
  providers: [
    WorkoutService,
    PrismaService,
    { provide: WorkoutRepository, useClass: PrismaWorkoutRepository },
  ],
  exports: [
    WorkoutService,
    { provide: WorkoutRepository, useClass: PrismaWorkoutRepository },
  ],
})
export class WorkoutModule { }
