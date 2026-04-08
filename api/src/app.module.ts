import { Module } from '@nestjs/common';
import { EnvConfigModule } from './config/env/env-cofig.module';
import { PrismaModule } from './config/database/prisma.module';
import { RabbitmqModule } from './config/rabbitmq/rabbitmq.module';
import { MailModule } from './config/mail/mail.module';
import { PayablesModule } from './modules/payables/payables.module';
import { AssignorsModule } from './modules/assignors/assignors.module';
import { UsersModule } from './modules/users/users.module';
import { ConsumerModule } from './consumer/consumer.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    EnvConfigModule,
    PrismaModule,
    RabbitmqModule,
    MailModule,
    PayablesModule,
    AssignorsModule,
    UsersModule,
    ConsumerModule,
    AuthModule,
  ],
})
export class AppModule {}
