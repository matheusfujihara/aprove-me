import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReceivableModule } from './modules/receivable/receivable.module';

@Module({
  imports: [ReceivableModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
