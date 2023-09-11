import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/repositories/user-repository';
import { UpdateUserDto } from './dtos/update-user-dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) { }

  async createUser(params: CreateUserDto): Promise<User> {
    const { password } = params;
    const hashedPassword = await bcrypt.hash(password, 6);
    const newUser = await this.userRepository.create({
      first_name: params.firstName,
      last_name: params.lastName,
      password: hashedPassword,
      email: params.email,
    });
    return newUser;
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findUserById(userId);
    return user;
  }

  async findManyUsers(page?: number): Promise<User[]> {
    const skip = page !== undefined ? page - 1 : 0;
    const users = await this.userRepository.findAllUsers(skip);
    return users;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findUserByEmail(email);
    return user;
  }

  async updateUser(userId: string, data: UpdateUserDto): Promise<void> {
    await this.userRepository.updateUser(userId, data);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.userRepository.deleteUser(userId);
  }
}
