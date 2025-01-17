import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ProjectsModule } from './projects/projects.module';
import { OrganizationalUnitsModule } from './organizational_units/organizational_units.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { TransfersModule } from './transfers/transfers.module';
import { AuthModule } from './auth/auth.module';

import dbConfig from '../config/database.config';
import authConfig from '../config/auth.config';
import { JwtGuard } from './auth/guards/jwt.guard';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [dbConfig, authConfig],
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        DATABASE_USER: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    UsersModule,
    DatabaseModule,
    ProjectsModule,
    OrganizationalUnitsModule,
    VehiclesModule,
    TransfersModule,
    AuthModule,
    PermissionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
