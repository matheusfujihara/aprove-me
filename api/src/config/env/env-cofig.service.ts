import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvConfigService {
  constructor(private configService: ConfigService) {}

  get port() {
    return this.configService.get<number>('PORT');
  }

  get dbHost() {
    return this.configService.get<string>('DB_HOST');
  }

  get dbPort() {
    return this.configService.get<number>('DB_PORT');
  }

  get dbUsername() {
    return this.configService.get<string>('DB_USERNAME');
  }

  get dbPassword() {
    return this.configService.get<string>('DB_PASSWORD');
  }

  get dbDatabase() {
    return this.configService.get<string>('DB_DATABASE');
  }

  get dbSync() {
    return this.configService.get<boolean>('DB_SYNC');
  }

  get dbLogging() {
    return this.configService.get<boolean>('DB_LOGGING');
  }
}
