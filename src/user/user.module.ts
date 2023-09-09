import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/infra/database/prisma.service';
import { WorkoutModule } from 'src/workout/workout.module';
import { UserRepository } from 'src/repositories/user-repository';
import { PrismaUserRepository } from 'src/repositories/prisma/prisma-user-repository';

@Module({
  imports: [WorkoutModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, { provide: UserRepository, useClass: PrismaUserRepository }],
  exports: [UserService, PrismaService],
})
export class UserModule { }
