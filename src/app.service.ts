import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CacheService } from './core/cache/cache.service';
import { LoggerService } from './core/logger/logger.service';
import { DatabaseService } from './database/database.service';

@Injectable()
export class AppService {
  private context = 'AppService';
  constructor(
    private configService: ConfigService,
    private logger: LoggerService,
    private databaseService: DatabaseService,
    private cache: CacheService,
  ) {}

  async getHello() {
    this.logger.log('calling log from inside getHello method', this.context);
    const envTest = this.configService.get<string>('environment');

    const users = await this.databaseService.user.findMany();
    this.cache.set('key', 'VALUE FROM CACHE', 1000);
    const value = await this.cache.get('key');

    console.log(value, envTest, users);

    return 'Hello World!';
  }
}
