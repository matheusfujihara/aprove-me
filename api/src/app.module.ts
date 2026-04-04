import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvConfigModule } from './config/env/env-cofig.module';
import { DatabaseProvider } from './config/database/database.provider';
import { PayablesModule } from './modules/payables/payables.module';
import { ReceivablesModule } from './modules/receivables/receivables.module';
import { AssignorsModule } from './modules/assignors/assignors.module';

@Module({
  imports: [
    EnvConfigModule,
    TypeOrmModule.forRootAsync({
      useClass: DatabaseProvider,
    }),
    PayablesModule,
    ReceivablesModule,
    AssignorsModule,
  ],
})
export class AppModule {}
