import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { WorkoutModule } from './workout/workout.module';
import { ExerciseModule } from './exercise/exercise.module';
import { AuthModule } from './security/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './security/auth/jwt-auth.guard';

@Module({
  imports: [UserModule, WorkoutModule, ExerciseModule, AuthModule],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
  controllers: [AppController],
})
export class AppModule {}
