import { Module } from '@nestjs/common';
import { UsersController } from './infrastructure/controllers/users.controller';
import { UserRepository } from './domain/repository/user.repository';
import { UserPrismaRepository } from './infrastructure/persistence/user-prisma.repository';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfigService } from '../../config/env/env-cofig.service';
import { EnvConfigModule } from '../../config/env/env-cofig.module';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';

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
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: UserRepository,
      useClass: UserPrismaRepository,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    CreateUserUseCase,
    LoginUseCase,
  ],
})
export class UsersModule {}
