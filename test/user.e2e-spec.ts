import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { User, Workout } from '@prisma/client';
import { EmailAlreadyRegister } from 'src/erros/email-already-register';
import { UserService } from 'src/user/user.service';
import { UserTestModule } from './modules/user-test.module';
import { WorkoutService } from 'src/workout/workout.service';
import { CreateWorkoutDto } from 'src/workout/dtos/create-workout-dto';
import { PrismaService } from 'src/infra/database/prisma.service';
import { CreateAndAuthenticateUserService } from 'src/utils/test/create-and-authenticate-user.service';

describe('User e2e test', () => {
  let _app: INestApplication;
  let app: INestApplication;
  let userService: UserService;
  let workoutService: WorkoutService;
  let createAndAuthenticateUserService: CreateAndAuthenticateUserService;
  let prismaService: PrismaService;
  let user: User;
  let newUserId: string;
  let token: string;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [UserTestModule],
    }).compile();

    _app = moduleRef.createNestApplication();
    await _app.init();
    app = _app.getHttpServer();

    userService = moduleRef.get<UserService>(UserService);
    workoutService = moduleRef.get<WorkoutService>(WorkoutService);
    createAndAuthenticateUserService = await moduleRef.resolve<CreateAndAuthenticateUserService>(CreateAndAuthenticateUserService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);

    const data = await createAndAuthenticateUserService.execute();
    user = data.user;
    token = data.acess_token;
  });


  afterAll(async () => {
    await _app.close();
  });

  it('should POST an user at /users', async () => {
    const createUserDto: CreateUserDto = {
      firstName: 'Gabriel',
      lastName: 'Pensador',
      email: 'pensador@gmail.com',
      password: 'password',
    };
    const response = await request(app)
      .post('/users')
      .send(createUserDto)
      .expect(201);

    const newUser: User = response.body.user;
    newUserId = newUser.id;
    expect(newUser).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: createUserDto.email,
      })
    )
    expect(newUser).not.toHaveProperty('password');

  });

  it("shouldn't POST an user with same email at /users", async () => {
    const createUserDto: CreateUserDto = {
      firstName: 'Gabriel',
      lastName: 'Pensador',
      email: 'pensador@gmail.com',
      password: 'password',
    };
    const response = await request(app).post('/users')
      .send(createUserDto)
      .expect(400);

    expect(response.body.message).toEqual(new EmailAlreadyRegister().message);

    await userService.deleteUser(newUserId);
  })

  it('should GET a user details at /users/:userId', async () => {
    const response = await request(app)
      .get(`/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.user).toEqual(
      expect.objectContaining({
        id: user.id,
        email: user.email,
      }),
    );
    expect(response.body.user).not.toHaveProperty('password');
    // await userService.deleteUSer(user.id);
  });


  it("should GET all user's workouts at /users/:userId/workouts", async () => {
    for (let i = 0; i < 2; i++) {
      const createWorkoutDto: CreateWorkoutDto = {
        workout_name: `workout ${i}`,
        user_id: user.id
      }
      await workoutService.create(createWorkoutDto);
    }

    const response = await request(app)
      .get(`/users/${user.id}/workouts`)
      .set("Authorization", `Bearer ${token}`)
      .query({ page: 1 })
      .expect(200)

    const workouts: Workout[] = response.body.workouts;
    expect(workouts).toHaveLength(2);
    expect(workouts).toEqual([
      expect.objectContaining({ workout_name: "workout 0" }),
      expect.objectContaining({ workout_name: "workout 1" }),
    ]);
    workouts.forEach(async (element) => await workoutService.deleteWorkout(element.id))
    // await userService.deleteUSer(user.id);
  })

  it("should be able to GET paginated user's workouts at /users/:userId/workouts", async () => {
    for (let i = 0; i < 12; i++) {
      const createWorkoutDto: CreateWorkoutDto = {
        workout_name: `workout ${i}`,
        user_id: user.id
      }
      await workoutService.create(createWorkoutDto);
    }

    const response = await request(app)
      .get(`/users/${user.id}/workouts`)
      .set("Authorization", `Bearer ${token}`)
      .query({ page: 2 })
      .expect(200)

    const workouts: Workout[] = response.body.workouts;
    expect(workouts).toHaveLength(2);
    expect(workouts).toEqual([
      expect.objectContaining({ workout_name: "workout 10" }),
      expect.objectContaining({ workout_name: "workout 11" }),
    ])

    //TODO: Delete only the workouts tests 
    await prismaService.workout.deleteMany();
    // await userService.deleteUSer(user.id);

  })

  it("should UPDATE (PUT) an user", async () => {
    const updateDto = {
      firstName: "Jonh",
      lastName: "Wick",
    }
    await request(app)
      .put(`/users/${user.id}`)
      .send(updateDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    const updatedUser = await userService.findUserById(user.id);

    expect(updatedUser).toEqual(
      expect.objectContaining({
        first_name: updateDto.firstName,
        last_name: updateDto.lastName
      })
    )
    // await userService.deleteUSer(user.id);
  })


  it("should DELETE a user at/users/:userId", async () => {
    await new Promise((resolve, _reject) => {
      setTimeout(() => {
        resolve("Resolve")
      }, 1000)
    })
    await request(app)
      .delete(`/users/${user.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  })
});
