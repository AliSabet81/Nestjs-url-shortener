import { ConfigService } from '@nestjs/config';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { AppService } from './app.service';
import { CacheService } from './core/cache/cache.service';
import { LoggerService } from './core/logger/logger.service';
import { DatabaseService } from './database/database.service';

describe('AppService', () => {
  let appService: AppService;
  // let cacheService: DeepMocked<CacheService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        { provide: LoggerService, useValue: createMock<LoggerService>() },
        { provide: ConfigService, useValue: createMock<ConfigService>() },
        { provide: DatabaseService, useValue: createMock<DatabaseService>() },
        { provide: CacheService, useValue: createMock<CacheService>() },
      ],
    }).compile();

    appService = app.get<AppService>(AppService);
    // cacheService = app.get(CacheService);
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      // cacheService.get.mockResolvedValue('VALUE FROM CACHE');
      const result = await appService.getHello();
      expect(result).toBe('Hello World!');
    });
  });
});
