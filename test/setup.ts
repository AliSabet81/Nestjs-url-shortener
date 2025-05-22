import helmet from 'helmet';
import { App } from 'supertest/types';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import { AppModule } from './../src/app.module';
import { CacheService } from '../src/core/cache/cache.service';
import { DatabaseService } from '../src/database/database.service';

let app: INestApplication<App>;
let server: App;
// let configService: ConfigService;
let databaseService: DatabaseService;
let cacheService: CacheService;

beforeEach(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.init();
  server = app.getHttpServer();
  // configService = app.get(ConfigService);
  databaseService = app.get(DatabaseService);
  cacheService = app.get(CacheService);
});

afterEach(async () => {
  // after each test, reset the database and chache
  await cacheService.reset();
  await databaseService.resetDb();
});

afterAll(async () => {
  await app.close();
});

export { server };
