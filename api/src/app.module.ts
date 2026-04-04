import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceivableModule } from './modules/receivable/receivable.module';
import { AssignorModule } from './modules/assignor/assignor.module';
import { EnvConfigModule } from './config/env/env-cofig.module';
import { DatabaseProvider } from './config/database/database.provider';

@Module({
  imports: [
    EnvConfigModule,
    TypeOrmModule.forRootAsync({
      useClass: DatabaseProvider,
    }),
    ReceivableModule,
    AssignorModule,
  ],
})
export class AppModule {}
