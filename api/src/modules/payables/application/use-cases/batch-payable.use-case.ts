import { Injectable, Logger } from '@nestjs/common';
import { RabbitmqService } from '../../../../config/rabbitmq/rabbitmq.service';
import { BatchPayableDto } from '../dto/batch-payable.dto';
import { randomUUID } from 'crypto';
import { PAYABLE_QUEUE } from 'src/shared/const/rabbitmq';

@Injectable()
export class BatchPayableUseCase {
  private readonly logger = new Logger(BatchPayableUseCase.name);

  constructor(private readonly rabbitmqService: RabbitmqService) {}

  async execute(dto: BatchPayableDto) {
    const batchId = randomUUID();
    const totalItems = dto.payables.length;

    this.logger.log(`Recebido lote ${batchId} com ${totalItems} pagáveis`);

    for (const payable of dto.payables) {
      await this.rabbitmqService.publish(PAYABLE_QUEUE, {
        batchId,
        totalItems,
        retryCount: 0,
        data: payable,
      });
    }

    this.logger.log(`Lote ${batchId} publicado na fila com ${totalItems} itens`);

    return {
      batchId,
      totalItems,
      message: 'Lote recebido e enviado para processamento',
    };
  }
}
