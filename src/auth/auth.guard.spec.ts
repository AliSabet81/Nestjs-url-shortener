import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let configService: DeepMocked<ConfigService>;

  beforeEach(() => {
    configService = createMock<ConfigService>();
    configService.getOrThrow.mockReturnValue('SECRET');
    authGuard = new AuthGuard(configService);
    authGuard.onModuleInit();
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  it('should return true if the api key is valid', () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { 'x-api-key': 'SECRET' },
          header: () => 'SECRET',
        }),
      }),
    });
    const result = authGuard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should return false if the api key is invalid', () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { 'x-api-key': 'WRONG' },
          header: () => 'WRONG',
        }),
      }),
    });
    const result = () => authGuard.canActivate(context);
    expect(result).toThrow(UnauthorizedException);
  });

  it('should throw an false if the api key is not provided', () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: undefined,
          header: () => undefined,
        }),
      }),
    });
    const result = () => authGuard.canActivate(context);
    expect(result).toThrow(UnauthorizedException);
  });
});
