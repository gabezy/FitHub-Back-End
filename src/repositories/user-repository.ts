import { User } from '@prisma/client';

export abstract class UserRepository {
  abstract create(data: { first_name: string; last_name: string; password: string; email: string }): Promise<User>;
  abstract findUserById(userId: string): Promise<User>;
  abstract findUserByEmail(email: string): Promise<User>;
  abstract findAllUsers(page: number): Promise<User[]>
  abstract updateUser(userId: string, data: { firstName?: string, lastName?: string }): Promise<void>;
  abstract deleteUser(userId: string): Promise<void>
}
