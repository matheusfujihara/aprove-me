import { Module } from '@nestjs/common';
import { PayablesService } from './application/services/payables.service';
import { PayablesController } from './infrastructure/controllers/payables.controller';

@Module({
  controllers: [PayablesController],
  providers: [PayablesService],
})
export class PayablesModule {}
