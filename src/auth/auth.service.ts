import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import ms from 'ms';
import authConfig from '../../config/auth.config';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { PayloadToken } from './interfaces/payload-token.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(authConfig.KEY)
    private readonly configService: ConfigType<typeof authConfig>,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Credentials are not valid.');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (isMatch) {
      delete user.password_hash;
      return user;
    }
    return null;
  }

  generateJWT(user: User, response: Response) {
    const expires = new Date();
    expires.setMilliseconds(
      expires.getMilliseconds() +
        ms(String(this.configService.jwtAccessTokenExpirationTime)),
    );
    const payload: PayloadToken = { role: user.role.id, sub: user.id };
    const token = this.jwtService.sign(payload);

    response.cookie('Authentication', token, {
      secure: true,
      httpOnly: true,
      expires,
    });
    return {
      access_token: token,
    };
  }

  async getUserRolePermissions(id: number) {
    const user = await this.usersService.findOne(id);
    return user.role;
  }
}
