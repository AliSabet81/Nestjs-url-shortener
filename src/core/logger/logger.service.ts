/* eslint-disable @typescript-eslint/restrict-template-expressions */
import * as winston from 'winston';
import { ConfigService } from '@nestjs/config';
import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor(private readonly configService: ConfigService) {
    const isDevelopment =
      this.configService.get<string>('environment') === 'development';

    const { combine, timestamp, json, printf, colorize } = winston.format;

    const format = isDevelopment
      ? combine(
          colorize(),
          timestamp(),
          printf(
            ({ level, message, context, timestamp, meta }) =>
              `${timestamp} ${level} [${context}]: ${message} ${
                meta ? JSON.stringify(meta) : ''
              }`,
          ),
        )
      : combine(timestamp(), json());

    this.logger = winston.createLogger({
      format,
      transports: [new winston.transports.Console()],
    });
  }

  log(message: string, context?: string, meta?: any) {
    this.logger.info(message, { context, meta });
  }

  error(message: string, trace?: string, context?: string, meta?: any) {
    this.logger.error(message, { trace, context, meta });
  }

  warn(message: string, context?: string, meta?: any) {
    this.logger.warn(message, { context, meta });
  }
}
