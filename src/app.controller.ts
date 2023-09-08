import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './security/auth/local-auth.guard';
import { AuthService } from './security/auth/auth.service';
import { Public } from './security/set-metadata';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }
}
