import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import config from '../config';
import { CacheService } from './cache/cache.service';
import { LoggerService } from './logger/logger.service';
import { DatabaseService } from '../database/database.service';
import { LoggerMiddleware } from './middleware/logger/logger.middleware';
import { TransformResponseInterceptor } from './interceptors/transform-response/transform-response.interceptor';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const username = configService.get('redis.username');
        const password = configService.get('redis.password');
        return {
          store: redisStore,
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
          username,
          password,
          ttl: 10,
          no_ready_check: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    LoggerService,
    DatabaseService,
    CacheService,
  ],
  exports: [LoggerService, DatabaseService, CacheService],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
