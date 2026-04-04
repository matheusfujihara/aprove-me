import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { validate } from './env-config.validation';
import { EnvConfigService } from './env-cofig.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: process.env.NODE_ENV === 'test' ? undefined : validate,
      envFilePath: ['.env'],
      isGlobal: true,
    }),
  ],
  providers: [ConfigService, EnvConfigService],
  exports: [ConfigService, EnvConfigService],
})
export class EnvConfigModule {
  onModuleInit() {
    console.log(`The EnvConfigModule has been initialized.`);
  }
}
