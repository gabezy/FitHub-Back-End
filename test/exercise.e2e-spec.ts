import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ExerciseTestModule } from './modules/exercise-test.module';
import { PrismaService } from 'src/infra/database/prisma.service';
import { CreateAndAuthenticateUserService } from 'src/utils/test/create-and-authenticate-user.service';
import { WorkoutService } from 'src/workout/workout.service';
import { Exercise, User, Workout } from '@prisma/client';
import { CreateExerciseDto } from 'src/exercise/dtos/create-exericise-dto';
import { ExerciseService } from 'src/exercise/exercise.service';
import { UserService } from 'src/user/user.service';

describe("Exercise e2e test", () => {
  let _app: INestApplication;
  let app: INestApplication;
  let userService: UserService;
  let workoutService: WorkoutService;
  let exerciseService: ExerciseService;
  let createAndAuthenticateService: CreateAndAuthenticateUserService;
  let prismaService: PrismaService;
  let user: User;
  let token: string;
  let workout: Workout;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [ExerciseTestModule],
    }).compile();

    _app = moduleRef.createNestApplication();
    await _app.init();
    app = _app.getHttpServer();

    userService = moduleRef.get<UserService>(UserService);
    workoutService = moduleRef.get<WorkoutService>(WorkoutService);
    exerciseService = moduleRef.get<ExerciseService>(ExerciseService);
    createAndAuthenticateService = await moduleRef.resolve<CreateAndAuthenticateUserService>(CreateAndAuthenticateUserService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  })

  beforeEach(async () => {
    const data = await createAndAuthenticateService.execute();
    user = data.user;
    token = data.acess_token;

    workout = await workoutService.create({
      workout_name: "Full Body",
      user_id: user.id
    })
  })

  afterEach(async () => {
    await workoutService.deleteWorkout(workout.id);
    await userService.deleteUser(user.id);
  })


  afterAll(async () => {
    await _app.close()
  })

  it("should be able to POST an exercise at /exercises", async () => {
    const createExerciseDto: CreateExerciseDto = {
      exercise_name: "Puxada Alta",
      reps: 12,
      sets: 3,
      weight: 37,
      workout_id: workout.id,
      notes: "3 sets de aquecimento"
    }

    const response = await request(app)
      .post("/exercises")
      .send(createExerciseDto)
      .set("Authorization", `Bearer ${token}`)
      .expect(201);

    const exercise: Exercise = response.body.exercise;

    expect(exercise).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        exercise_name: createExerciseDto.exercise_name,
      })
    )
    await exerciseService.deleteExercise(exercise.id);
  })

  it("should be able to GET an exercise details at /exercises/:exerciseId", async () => {
    const createExerciseDto: CreateExerciseDto = {
      exercise_name: "Puxada Alta",
      reps: 12,
      sets: 3,
      weight: 37,
      workout_id: workout.id,
    }

    const exercise = await exerciseService.createExercise(createExerciseDto);

    const response = await request(app)
      .get(`/exercises/${exercise.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(response.body.exercise).toEqual(
      expect.objectContaining({
        id: exercise.id,
        exercise_name: exercise.exercise_name,
      })
    )

    await exerciseService.deleteExercise(exercise.id);
  })



})
