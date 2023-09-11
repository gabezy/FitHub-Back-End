import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/infra/database/prisma.service';
import { AuthModule } from 'src/security/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [AppModule, AuthModule, UserModule],
  providers: [PrismaService, JwtService],
})
export class AppTestModule { }
