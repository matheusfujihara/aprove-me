import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfigModule } from '../../config/env/env-cofig.module';
import { EnvConfigService } from '../../config/env/env-cofig.service';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    EnvConfigModule,
    JwtModule.registerAsync({
      imports: [EnvConfigModule],
      inject: [EnvConfigService],
      useFactory: (envConfigService: EnvConfigService) => ({
        secret: envConfigService.jwtSecret,
        signOptions: {
          expiresIn: envConfigService.jwtExpiresIn,
        },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    LoginUseCase,
  ],
})
export class AuthModule {}
