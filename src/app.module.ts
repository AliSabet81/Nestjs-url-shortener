import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { UrlModule } from './modules/url/url.module';

@Module({
  imports: [CoreModule, UrlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
