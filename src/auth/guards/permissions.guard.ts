import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';
import { PayloadToken } from '../interfaces/payload-token.interface';
import { PERMISSION_KEY } from '../decorators/permission.decorator';
import { Permissions } from '../enum/permissions.enum';
import { JwtService } from '@nestjs/jwt';
import authConfig from '../../../config/auth.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
    @Inject(authConfig.KEY)
    private readonly configService: ConfigType<typeof authConfig>,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const permission = this.reflector.get<Permissions>(
      PERMISSION_KEY,
      context.getHandler(),
    );

    if (!permission) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.getTokenFromCookie(request);
    try {
      const payload: PayloadToken = await this.jwtService.verifyAsync(token, {
        secret: this.configService.jwtAccessTokenSecret,
      });

      const user = await this.userService.findOne(payload.sub);

      const hasPermission = user.role.permissions.some(
        (userPermission) => userPermission.name === permission,
      );

      request['user'] = payload;

      if (!hasPermission) {
        throw new ForbiddenException('You do not have permission');
      }
    } catch {
      throw new ForbiddenException('You do not have permission');
    }

    return true;
  }

  private getTokenFromCookie(request: Request) {
    if (!request.cookies) {
      return null;
    }

    return request.cookies['Authentication'];
  }
}
