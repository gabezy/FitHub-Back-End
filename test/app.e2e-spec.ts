import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { AppTestModule } from './modules/app-test.module';

describe('App e2e test', () => {
  let _app: INestApplication;
  let app: INestApplication;
  let userService: UserService;
  let user: User;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppTestModule],
    }).compile();

    _app = moduleRef.createNestApplication();
    await _app.init();
    app = _app.getHttpServer();

    userService = moduleRef.get<UserService>(UserService);

    const createUserDto: CreateUserDto = {
      firstName: 'Jonh',
      lastName: 'Doe',
      email: 'jonhDoe@gmail.com',
      password: 'password',
    };

    user = await userService.createUser(createUserDto);

  });

  afterAll(async () => {
    await userService.deleteUser(user.id);
    await _app.close();
  });

  it('should POST at /login and return a JWT Token', async () => {
    const loginDto = { email: user.email, password: 'password' };

    const response = await request(app)
      .post('/login')
      .send(loginDto)
      .expect(201);

    const token = response.body.acess_token;

    expect(typeof response).toBe('object');
    expect(response.body).toHaveProperty('acess_token');

    const decodedToken = jwt.decode(token) as { [key: string]: any };

    expect(decodedToken.sub).toEqual(user.id);
    expect(decodedToken.email).toEqual(user.email);
  });
});
