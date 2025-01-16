import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { UsersModule } from '../src/users/users.module';
import { User } from '../src/users/entities/user.entity';
import { TempDB } from './config/test-db.config';

describe('UserModule (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = await TempDB([User]);
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        TypeOrmModule.forRoot({
          name: 'default',
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
      ],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer()).get('/users').expect(200).expect([]);
  });

  it('/users/:id (GET)', () => {
    return request(app.getHttpServer()).get('/users/1').expect(200).expect({});
  });

  it('/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        username: 'test',
        email: 'email@test.com',
        password: 'StrongPass123!',
      })
      .expect(201)
      .expect({});
  });
});
