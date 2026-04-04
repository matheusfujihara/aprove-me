import { plainToInstance } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsSemVer,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateIf,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Homologation = 'homologation',
  Test = 'test',
  Local = 'local',
}

enum LogLevel {
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Verbose = 'verbose',
  Debug = 'debug',
  Silly = 'silly',
}

export class EnvironmentVariables {
  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;

  @ValidateIf((object) => object.DATABASE_ENABLE)
  @IsNotEmpty()
  @IsString()
  DB_NAME: string;

  @ValidateIf((object) => object.DATABASE_ENABLE)
  @IsString()
  DB_DRIVER: string;

  @IsNotEmpty()
  @IsString()
  DB_HOST: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  DB_PORT: number;

  @IsNotEmpty()
  @IsString()
  DB_USERNAME: string;

  @IsNotEmpty()
  @IsString()
  DB_PASSWORD: string;

  @IsNotEmpty()
  @IsString()
  DB_DATABASE: string;

  @IsBoolean()
  DB_SYNC: boolean;

  @IsBoolean()
  DB_LOGGING: boolean;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
