import { ConfigService } from '@nestjs/config';

import { app } from '../../../test/setup';
import { UrlService } from './url.service';
import { createManyUrls } from './test-utils';
import { DatabaseService } from '../../database/database.service';

describe('UrlService Integration test', () => {
  let urlService: UrlService;
  let databaseService: DatabaseService;
  let configService: ConfigService;
  let host: string;

  beforeAll(() => {
    urlService = app.get<UrlService>(UrlService);
    databaseService = app.get<DatabaseService>(DatabaseService);
    configService = app.get(ConfigService);

    host = configService.getOrThrow(`host`);
  });
  describe('create', () => {
    it('should create a new url', async () => {
      const payload = {
        redirect: 'https://google.com',
        title: 'Google',
        description: 'Google description',
      };
      const url = await urlService.create(payload);
      const persistedUrl = await databaseService.url.findUnique({
        where: {
          url: url.url,
        },
      });

      expect(url).toEqual(persistedUrl);
    });
  });
  describe(`findAll`, () => {
    it(`should return empty array when no urls exist in database`, async () => {
      const response = await urlService.findAll({});

      expect(response.data).toEqual([]);
    });

    it(`should return array of persisted urls`, async () => {
      const mockedUrlsPayload = createManyUrls({ host });
      await databaseService.url.createMany({
        data: mockedUrlsPayload,
      });
      const urls = await databaseService.url.findMany({});

      const response = await urlService.findAll({});

      expect(response.data).toEqual(urls);
    });

    it(`should paginate results and show 1st page`, async () => {
      const mockedUrlsPayload = createManyUrls({ host });
      await databaseService.url.createMany({
        data: mockedUrlsPayload,
      });
      const total = await databaseService.url.count();
      const limit = 1;
      const page = 1;

      const response = await urlService.findAll({ page, limit });

      expect(response.meta).toEqual({
        total,
        currentPage: page,
        perPage: limit,
        totalPages: 3,
        nextPage: `${host}?limit=${limit}&page=2`,
        previousPage: null,
      });
    });

    it(`should paginate results and show middle page`, async () => {
      const mockedUrlsPayload = createManyUrls({ host });
      await databaseService.url.createMany({
        data: mockedUrlsPayload,
      });
      const total = await databaseService.url.count();
      const limit = 1;
      const page = 2;

      const response = await urlService.findAll({ page, limit });

      expect(response.meta).toEqual({
        total,
        currentPage: page,
        perPage: limit,
        totalPages: 3,
        nextPage: `${host}?limit=${limit}&page=3`,
        previousPage: `${host}?limit=${limit}&page=1`,
      });
    });

    it(`should paginate results and show last page`, async () => {
      const mockedUrlsPayload = createManyUrls({ host });
      await databaseService.url.createMany({
        data: mockedUrlsPayload,
      });
      const total = await databaseService.url.count();
      const limit = 1;
      const page = 3;

      const response = await urlService.findAll({ page, limit });

      expect(response.meta).toEqual({
        total,
        currentPage: page,
        perPage: limit,
        totalPages: 3,
        nextPage: null,
        previousPage: `${host}?limit=${limit}&page=2`,
      });
    });
  });
  describe(`findOne`, () => {
    it(`should return null when url does not exist`, async () => {
      // database is cleared before every test so no urls exist
      const url = await urlService.findOne(`non-existing-url`);

      expect(url).toBeNull();
    });

    it(`should return respective url when found`, async () => {
      const uid = `123456`;
      const persistedUrl = await databaseService.url.create({
        data: {
          title: `My special link`,
          redirect: `https://tomray.dev`,
          url: `${host}/${uid}`,
        },
      });
      const url = await urlService.findOne(uid);

      expect(url).toEqual(persistedUrl);
    });
  });
  describe(`update`, () => {
    it(`should update and return respective url`, async () => {
      await databaseService.url.create({
        data: {
          id: 1,
          title: `My special link`,
          redirect: `https://tomray.dev`,
          url: `${host}/123456`,
        },
      });
      const url = await urlService.update(1, { title: `Updated title` });
      const updatedPersistedUrl = await databaseService.url.findUnique({
        where: { id: 1 },
      });

      expect(url).toEqual(updatedPersistedUrl);
    });

    it(`should throw error when url does not exist`, async () => {
      const updateUrl = urlService.update(1, { title: `Updated title` });

      await expect(updateUrl).rejects.toThrow();
    });
  });
  describe(`remove`, () => {
    it(`should remove and return respective url`, async () => {
      const persistedUrl = await databaseService.url.create({
        data: {
          id: 1,
          title: `My special link`,
          redirect: `https://tomray.dev`,
          url: `${host}/123456`,
        },
      });
      const url = await urlService.remove(1);
      const removedPersistedUrl = await databaseService.url.findUnique({
        where: { id: 1 },
      });

      expect(url).toEqual(persistedUrl);
      expect(removedPersistedUrl).toBeNull();
    });

    it(`should throw error when url does not exist`, async () => {
      const removeUrl = urlService.remove(1);

      await expect(removeUrl).rejects.toThrow();
    });
  });
});
