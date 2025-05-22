import { Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';

import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}
  use(req: Request, res: Response, next: () => void) {
    res.on('finish', () => {
      const { method, url } = req;
      const statusCode = res.statusCode;
      const logData = {
        method,
        url,
        statusCode,
      };
      const logMessage = `[${method}] ${url} ${statusCode}`;

      if (statusCode >= 500) {
        this.logger.error(logMessage, undefined, 'HTTP', logData);
      } else if (statusCode >= 400) {
        this.logger.warn(logMessage, 'HTTP', logData);
      } else {
        this.logger.log(logMessage, 'HTTP', logData);
      }
    });
    next();
  }
}
