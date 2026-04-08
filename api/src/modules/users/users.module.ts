import { Module } from '@nestjs/common';
import { UsersController } from './infrastructure/controllers/users.controller';
import { UserRepository } from './domain/repository/user.repository';
import { UserPrismaRepository } from './infrastructure/persistence/user-prisma.repository';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: UserRepository,
      useClass: UserPrismaRepository,
    },
    CreateUserUseCase,
  ],
  exports: [UserRepository],
})
export class UsersModule {}
