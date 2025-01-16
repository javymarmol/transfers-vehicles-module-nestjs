import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';

import dbConfig from '../../config/database.config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [dbConfig.KEY],
      useFactory: (configService: ConfigType<typeof dbConfig>) => ({
        type: 'postgres',
        host: configService.host,
        port: configService.port,
        username: configService.user,
        password: configService.password,
        database: configService.dbName,
        synchronize: false,
        autoLoadEntities: true,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
