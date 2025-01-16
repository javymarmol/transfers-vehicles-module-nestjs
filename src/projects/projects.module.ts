import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './entities/project.entity';
import { User } from '../users/entities/user.entity';
import { OrganizationalUnit } from '../organizational_units/entities/organizational_unit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, User, OrganizationalUnit])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
