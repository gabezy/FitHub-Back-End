import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { WorkoutService } from 'src/workout/workout.service';
import { Public } from 'src/security/set-metadata';
import { EmailAlreadyRegister } from 'src/erros/email-already-register';
import { ResourceNotFound } from 'src/erros/resource-not-found';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private workoutService: WorkoutService,
  ) { }

  @Public()
  @Post()
  async postUser(@Body() data: CreateUserDto) {
    const emailExists = await this.userService.findUserByEmail(data.email);
    if (emailExists !== null) {
      throw new HttpException(new EmailAlreadyRegister().message, HttpStatus.BAD_REQUEST)
    }
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
    try {
      const user = await this.userService.findUserById(userId);
      Reflect.deleteProperty(user, 'password');
      return { user };
    } catch (error) {
      if (error instanceof ResourceNotFound) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND)
      }
      throw error
    }
  }

  @Get(':userId/workouts')
  async getWorkoutsByUserId(@Param('userId') userId: string, @Query("page") page: number) {
    const workouts = await this.workoutService.findWorkoutsByUserId(userId, Number(page));
    return { workouts };
  }

  @Put(':userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() data: { firstName: string, lastName: string },
  ) {
    await this.userService.updateUser(userId, data);
  }

  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string) {
    await this.userService.deleteUser(userId);
  }
}
