import { User } from '@prisma/client';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';

abstract class UserRepository {
  abstract create(data: CreateUserDto): Promise<User>;
}
