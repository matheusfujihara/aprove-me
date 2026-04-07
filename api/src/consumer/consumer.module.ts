import { Module } from '@nestjs/common';
import { PayableConsumerService } from './payable-consumer.service';
import { PayablesModule } from '../modules/payables/payables.module';

@Module({
  imports: [PayablesModule],
  providers: [PayableConsumerService],
})
export class ConsumerModule {}
