import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ProjectsService } from '../projects/projects.service';
import { Project } from '../projects/entities/project.entity';
import { OrganizationalUnit } from '../organizational_units/entities/organizational_unit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Project, OrganizationalUnit])],
  controllers: [UsersController],
  providers: [UsersService, ProjectsService],
  exports: [UsersService],
})
export class UsersModule {}
