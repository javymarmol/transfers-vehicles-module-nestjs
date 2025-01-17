import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, User])],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
