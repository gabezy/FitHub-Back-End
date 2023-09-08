import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) { }

  async createUser(params: CreateUserDto): Promise<User> {
    const { password } = params;
    const hashedPassword = await bcrypt.hash(password, 6);
    const newUser = await this.prismaService.user.create({
      data: {
        first_name: params.firstName,
        last_name: params.lastName,
        password: hashedPassword,
        email: params.email,
      },
    });
    return newUser;
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    return user;
  }

  async findManyUsers(page?: number): Promise<User[]> {
    const skip = page !== undefined ? page - 1 : 0;
    const users = await this.prismaService.user.findMany({
      skip: skip,
      take: 10,
      orderBy: { id: 'asc' },
    });
    return users;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { email: email },
    });
    return user;
  }

  async updateUser(params: {
    id: string;
    data: Prisma.UserUpdateInput;
  }): Promise<void> {
    const { id, data } = params;
    await this.prismaService.user.update({
      data: { ...data, updated_at: new Date() },
      where: { id },
    });
  }

  async deleteUSer(id: string): Promise<void> {
    await this.prismaService.user.delete({ where: { id } });
  }
}
