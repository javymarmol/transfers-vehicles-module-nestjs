import { Module } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transfer } from './entities/transfer.entity';
import { Project } from '../projects/entities/project.entity';
import { OrganizationalUnit } from '../organizational_units/entities/organizational_unit.entity';
import { ProjectsService } from '../projects/projects.service';
import { OrganizationalUnitsService } from '../organizational_units/organizational_units.service';
import { UsersService } from '../users/users.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { User } from '../users/entities/user.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import authConfig from '../../config/auth.config';
import { ConfigType } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      Transfer,
      Project,
      OrganizationalUnit,
      User,
      Vehicle,
    ]),
    JwtModule.registerAsync({
      inject: [authConfig.KEY],
      useFactory: (configService: ConfigType<typeof authConfig>) => ({
        global: true,
        secret: configService.jwtAccessTokenSecret,
        signOptions: {
          expiresIn: configService.jwtAccessTokenExpirationTime,
        },
      }),
    }),
  ],
  controllers: [TransfersController],
  providers: [
    TransfersService,
    ProjectsService,
    UsersService,
    OrganizationalUnitsService,
    VehiclesService,
  ],
})
export class TransfersModule {}
