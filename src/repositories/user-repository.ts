import { User } from '@prisma/client';
import { UpdateUserDto } from 'src/user/dtos/update-user-dto';

export abstract class UserRepository {
  abstract create(data: { first_name: string; last_name: string; password: string; email: string }): Promise<User>;
  abstract findUserById(userId: string): Promise<User>;
  abstract findUserByEmail(email: string): Promise<User>;
  abstract findAllUsers(page: number): Promise<User[]>
  abstract updateUser(userId: string, data: UpdateUserDto): Promise<void>;
  abstract deleteUser(userId: string): Promise<void>
}
