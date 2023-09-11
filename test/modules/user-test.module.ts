import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from 'src/app.module';
import { AuthModule } from 'src/security/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { CreateAndAuthenticateUserService } from 'src/utils/test/create-and-authenticate-user.service';
import { WorkoutModule } from 'src/workout/workout.module';

@Module({
  imports: [UserModule, AppModule, WorkoutModule, AuthModule],
  providers: [CreateAndAuthenticateUserService, JwtService],
})
export class UserTestModule { }
