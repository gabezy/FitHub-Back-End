import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { ExerciseRepository } from 'src/repositories/exercise-repository';
import { PrismaExerciseRepository } from 'src/repositories/prisma/prisma-exercise-repository';
import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exerice.controller';

@Module({
  imports: [],
  controllers: [ExerciseController],
  providers: [
    ExerciseService,
    PrismaService,
    { provide: ExerciseRepository, useClass: PrismaExerciseRepository },
  ],
  exports: [
    ExerciseService,
    { provide: ExerciseRepository, useClass: PrismaExerciseRepository },
  ],
})
export class ExerciseModule { }
