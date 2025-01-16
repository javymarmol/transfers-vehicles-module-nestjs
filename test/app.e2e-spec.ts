import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, LoggerService } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { DataSource } from "typeorm";
import { TypeOrmModule } from "@nestjs/typeorm";
import "reflect-metadata";

import { TempDB } from "./config/test-db.config";
import { User } from "../src/users/entities/user.entity";

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  class TestLogger implements LoggerService {
    log(message: string) {}

    error(message: string, trace: string) {}

    warn(message: string) {}

    debug(message: string) {}

    verbose(message: string) {}
  }

  beforeEach(async () => {
    dataSource = await TempDB([User]);
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forFeature([User]),
       // TypeOrmModule.forRoot({
        //   name: 'default',
        //   synchronize: true,
        // }),
      ],
    })
      / .overrideProvider(DataSource)
      // .useValue(dataSource)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useLogger(new TestLogger());
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it("/users (GET)", () => {
    return request(app.getHttpServer()).get("/users").expect(200).expect([]);
  });
});
