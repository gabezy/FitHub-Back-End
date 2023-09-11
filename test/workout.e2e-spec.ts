import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateWorkoutDto } from 'src/workout/dtos/create-workout-dto';
import { WorkoutTestModule } from './modules/workout-test.module';
import { CreateAndAuthenticateUserService } from 'src/utils/test/create-and-authenticate-user.service';
import { User } from '@prisma/client';
import { WorkoutService } from 'src/workout/workout.service';
import { UserService } from 'src/user/user.service';
import { UpdateWorkoutDto } from 'src/workout/dtos/update-workout-dto';

describe("Workout e2e test", () => {
  let _app: INestApplication;
  let app: INestApplication;
  let workoutService: WorkoutService;
  let userService: UserService;
  let createAndAuthenticateService: CreateAndAuthenticateUserService;
  let user: User;
  let token: string;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [WorkoutTestModule],
    }).compile();

    _app = moduleRef.createNestApplication();
    await _app.init();
    app = _app.getHttpServer();

    workoutService = moduleRef.get<WorkoutService>(WorkoutService);
    createAndAuthenticateService = moduleRef.get<CreateAndAuthenticateUserService>(CreateAndAuthenticateUserService);
    userService = moduleRef.get<UserService>(UserService);

  })

  beforeEach(async () => {
    const data = await createAndAuthenticateService.execute();
    user = data.user;
    token = data.acess_token;
  })

  afterEach(async () => {
    await userService.deleteUser(user.id);
  })

  afterAll(async () => {
    await _app.close();
  })



  it("should POST a workout at /workouts", async () => {
    const createWorkoutDto: CreateWorkoutDto = {
      user_id: user.id,
      workout_name: "Full Body"
    }
    const response = await request(app)
      .post("/workouts")
      .send(createWorkoutDto)
      .set("Authorization", `Bearer ${token}`)
      .expect(201);

    const workout = response.body.workout;
    expect(workout).toEqual(
      expect.objectContaining({
        workout_name: createWorkoutDto.workout_name,
        user_id: user.id
      })
    )
    await workoutService.deleteWorkout(workout.id)
  })

  it("should GET a workout details at /workouts/:workoutId", async () => {
    const createWorkoutDto: CreateWorkoutDto = {
      user_id: user.id,
      workout_name: "Full Body"
    }
    const workout = await workoutService.create(createWorkoutDto);

    const response = await request(app)
      .get(`/workouts/${workout.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body.workout).toEqual(
      expect.objectContaining({
        id: workout.id,
        workout_name: workout.workout_name,
        user_id: workout.user_id,
      })
    )
    await workoutService.deleteWorkout(workout.id);

  })

  it("should UPDATE (PUT) a workout at/workouts/:workoutId", async () => {
    const createWorkoutDto: CreateWorkoutDto = {
      user_id: user.id,
      workout_name: "Full Body"
    }
    const workout = await workoutService.create(createWorkoutDto);
    const updateWorkoutDto: UpdateWorkoutDto = {
      workout_name: "Legs"
    }

    await request(app)
      .put(`/workouts/${workout.id}`)
      .send(updateWorkoutDto)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const updatedWorkout = await workoutService.findWorkoutById(workout.id);
    expect(updatedWorkout).toEqual(
      expect.objectContaining({
        id: workout.id,
        workout_name: updateWorkoutDto.workout_name,
        updated_at: expect.any(Date),
      })
    )

    await workoutService.deleteWorkout(workout.id);
  })


  it("should DELETE a workout at /workouts/:workoutId", async () => {
    const createWorkoutDto: CreateWorkoutDto = {
      user_id: user.id,
      workout_name: "Full Body"
    }
    const workout = await workoutService.create(createWorkoutDto);

    await request(app)
      .delete(`/workouts/${workout.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)

  })
})
