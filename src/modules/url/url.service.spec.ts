import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

import { UrlService } from './url.service';
import { UidService } from '../../services/uid/uid.service';
import { DatabaseService } from '../../database/database.service';
describe('UrlService', () => {
  let urlService: UrlService;
  let uidService: DeepMocked<UidService>;
  let configService: DeepMocked<ConfigService>;
  let databaseService: DeepMockProxy<DatabaseService>;
  const host = 'localhost:3000';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        { provide: UidService, useValue: createMock<UidService>() },
        { provide: ConfigService, useValue: createMock<ConfigService>() },
        { provide: DatabaseService, useValue: mockDeep<DatabaseService>() },
      ],
    }).compile();
    const app = module.createNestApplication();

    urlService = module.get<UrlService>(UrlService);
    uidService = module.get(UidService);
    configService = module.get(ConfigService);
    configService.getOrThrow.mockReturnValue(host);
    databaseService = module.get(DatabaseService);

    await app.init();
  });

  it('should be defined', () => {
    expect(urlService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new url', async () => {
      const payload = {
        redirect: 'https://google.com',
        title: 'Google',
        description: 'Google',
      };
      const uid = 'random-uid';
      const mockedUrl = {
        ...payload,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        url: `${host}/${uid}`,
      };
      uidService.generate.mockReturnValueOnce(uid);
      databaseService.url.create.mockResolvedValueOnce(mockedUrl);
      const result = await urlService.create(payload);
      expect(result).toEqual(mockedUrl);
    });
  });
});
