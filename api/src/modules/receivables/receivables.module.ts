import { Module } from '@nestjs/common';
import { ReceivablesService } from './application/services/receivables.service';
import { ReceivablesController } from './infrastructure/controllers/receivables.controller';

@Module({
  controllers: [ReceivablesController],
  providers: [ReceivablesService],
})
export class ReceivablesModule {}
