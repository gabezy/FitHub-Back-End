import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/infra/database/prisma.service';
import { WorkoutModule } from 'src/workout/workout.module';

@Module({
  imports: [WorkoutModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService, PrismaService],
})
export class UserModule { }
