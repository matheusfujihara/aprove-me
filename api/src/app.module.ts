import { Module } from '@nestjs/common';
import { EnvConfigModule } from './config/env/env-cofig.module';
import { PrismaModule } from './config/database/prisma.module';
import { PayablesModule } from './modules/payables/payables.module';
import { AssignorsModule } from './modules/assignors/assignors.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    EnvConfigModule,
    PrismaModule,
    PayablesModule,
    AssignorsModule,
    UsersModule,
  ],
})
export class AppModule {}
