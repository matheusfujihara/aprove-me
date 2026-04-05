import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';

@Injectable()
export class EnvConfigService {
  constructor(private configService: ConfigService) {}

  get port() {
    return this.configService.get<number>('PORT');
  }

  get databaseUrl() {
    return this.configService.get<string>('DATABASE_URL');
  }

  get jwtSecret() {
    return this.configService.getOrThrow<string>('JWT_SECRET');
  }

  get jwtExpiresIn() {
    return (this.configService.get<string>('JWT_EXPIRES_IN') ??
      '1d') as StringValue;
  }
}
