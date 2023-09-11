import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/infra/database/prisma.service";
import { AuthModule } from "src/security/auth/auth.module";
import { UserModule } from "src/user/user.module";
import { CreateAndAuthenticateUserService } from "src/utils/test/create-and-authenticate-user.service";
import { WorkoutModule } from "src/workout/workout.module";

@Module({
  imports: [WorkoutModule, UserModule, AuthModule],
  providers: [PrismaService, CreateAndAuthenticateUserService, JwtService]
})
export class WorkoutTestModule { }
