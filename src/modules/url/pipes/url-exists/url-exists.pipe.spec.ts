import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { UrlExistsPipe } from './url-exists.pipe';
import { UrlService } from 'src/modules/url/url.service';
import { Url } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
describe('UrlExistsPipe', () => {
  let urlExistsPipe: UrlExistsPipe;
  let urlService: DeepMocked<UrlService>;

  beforeEach(() => {
    urlService = createMock<UrlService>();
    urlExistsPipe = new UrlExistsPipe(urlService);
  });

  it('should be defined', () => {
    expect(urlExistsPipe).toBeDefined();
  });

  it('should return url if the url exists', async () => {
    const url: Url = {
      id: 1,
      redirect: 'https://google.com',
      url: 'localhost:3000/random-uid',
      title: 'Google',
      description: 'Google description',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    urlService.findOne.mockResolvedValueOnce(url);
    const result = await urlExistsPipe.transform('random-uid');
    expect(result).toEqual(url);
  });

  it('should throw an error if the url does not exist', async () => {
    urlService.findOne.mockResolvedValueOnce(null);
    const result = () => urlExistsPipe.transform('random-uid');
    await expect(result).rejects.toThrow(NotFoundException);
  });
});
