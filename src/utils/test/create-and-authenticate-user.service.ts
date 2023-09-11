import { Injectable } from "@nestjs/common";
import { AuthService } from "src/security/auth/auth.service";
import { CreateUserDto } from "src/user/dtos/create-user.dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class CreateAndAuthenticateUserService {

  //TODO: Fix user email constrains at tests e2e (should work without the random number at the email)
  private random = Math.ceil(Math.random() * 100);

  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) { }

  async execute() {
    const createUserDto: CreateUserDto = {
      firstName: 'Jonh',
      lastName: 'Doe',
      email: `jonhDoe${this.random}@example.com`,
      password: 'password',
    };

    const user = await this.userService.createUser(createUserDto);

    const validateUser = await this.authService.validateUser(createUserDto.email, createUserDto.password);
    const { acess_token } = await this.authService.login(validateUser);

    return {
      user,
      acess_token
    }

  }
}
