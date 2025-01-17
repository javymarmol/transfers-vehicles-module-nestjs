import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/entities/user.entity';
import { Request, Response } from 'express';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  login(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
    const user = req.user as User;
    return this.authService.generateJWT(user, response);
  }
}
