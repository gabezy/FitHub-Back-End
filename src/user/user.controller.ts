import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { Prisma, User } from '@prisma/client';
import { WorkoutService } from 'src/workout/workout.service';
import { Public } from 'src/security/set-metadata';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private workoutService: WorkoutService,
  ) {}

  @Public()
  @Post()
  async postUser(@Body() data: CreateUserDto) {
    const user = await this.userService.createUser(data);
    Reflect.deleteProperty(user, 'password');
    return { user };
  }

  @Get()
  async getUsers(@Query('page') page: number) {
    const usersArr = await this.userService.findManyUsers(page);
    const users = usersArr.map((user) => {
      Reflect.deleteProperty(user, 'password');
      return user;
    });
    return { users };
  }

  @Get(':userId')
  async getUser(@Param('userId') userId: string) {
    const user = await this.userService.findUserById(userId);
    Reflect.deleteProperty(user, 'password');
    return { user };
  }

  @Get(':userId/workouts')
  async getWorkoutsByUserId(@Param('userId') userId: string) {
    const workouts = await this.workoutService.findWorkoutsByUserId(userId);
    return { workouts };
  }

  @Put(':userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() data: Prisma.UserUpdateInput,
  ) {
    await this.userService.updateUser({ id: userId, data });
  }

  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string) {
    await this.userService.deleteUSer(userId);
  }
}
