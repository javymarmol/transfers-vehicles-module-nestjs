import { SetMetadata } from '@nestjs/common';
import { Permissions } from '../enum/permissions.enum';

export const PERMISSION_KEY = 'permission';

export const Permission = (permissions: Permissions) =>
  SetMetadata(PERMISSION_KEY, permissions);
