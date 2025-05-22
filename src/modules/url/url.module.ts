import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';

@Module({
  controllers: [UrlController],
  providers: [UrlService],
})
export class UrlModule {}
