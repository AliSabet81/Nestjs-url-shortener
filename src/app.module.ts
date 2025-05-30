import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { AppController } from './app.controller';
import { UrlModule } from './modules/url/url.module';
import { UidModule } from './services/uid/uid.module';

@Module({
  imports: [CoreModule, UrlModule, UidModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
