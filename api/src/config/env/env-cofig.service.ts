import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvConfigService {
  constructor(private configService: ConfigService) {}

  get port() {
    return this.configService.get<number>('PORT');
  }

  get databaseUrl() {
    return this.configService.get<string>('DATABASE_URL');
  }
}
