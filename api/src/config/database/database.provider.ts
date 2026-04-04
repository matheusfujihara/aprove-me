import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DatabaseProvider implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    console.log(__dirname);
    return {
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? '5432'),
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_DATABASE ?? 'mottu_test',
      autoLoadEntities: true,
      synchronize: process.env.DB_SYNC === 'true' ? true : false,
      logging: process.env.DB_LOGGING === 'development' ? false : false,
      migrations: [__dirname + '/migrations/*.{ts}'],
      migrationsRun: true,
    };
  }
}
