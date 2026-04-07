import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitmqService } from '../config/rabbitmq/rabbitmq.service';
import { MailService } from '../config/mail/mail.service';
import { CreatePayableUseCase } from '../modules/payables/application/use-cases/create-payable.use-case';
import { PAYABLE_DLQ, PAYABLE_QUEUE } from 'src/shared/const/rabbitmq';
import { BatchTracker, PayableMessage } from 'src/shared/interfaces/rabbitmq';

export const MAX_RETRIES = Number(process.env.RABBITMQ_MAX_RETRIES) ?? 4;

@Injectable()
export class PayableConsumerService implements OnModuleInit {
  private readonly logger = new Logger(PayableConsumerService.name);
  private readonly batchTrackers = new Map<string, BatchTracker>();

  constructor(
    private readonly rabbitmqService: RabbitmqService,
    private readonly createPayableUseCase: CreatePayableUseCase,
    private readonly mailService: MailService,
  ) {}

  async onModuleInit() {
    await this.consumePayableQueue();
    await this.consumeDeadLetterQueue();
  }

  private async consumePayableQueue() {
    this.logger.log(`initalize payable queue`)
    const channel = this.rabbitmqService.getChannel();
    await channel.prefetch(1);

    await channel.consume(
      PAYABLE_QUEUE,
      async (msg) => {
        if (!msg) return;

        const content: PayableMessage = JSON.parse(msg.content.toString());
        const { batchId, totalItems, retryCount, data } = content;
        const tracker = this.getOrCreateTracker(batchId, totalItems);

        try {
          await this.createPayableUseCase.execute(data);
          tracker.success++;
          tracker.processed++;
          channel.ack(msg);

          this.logger.debug(
            `Pagável processado com sucesso (batch ${batchId}) [${tracker.processed}/${totalItems}]`,
          );
        } catch (error: any) {
          channel.ack(msg);

          if (retryCount < MAX_RETRIES) {
            this.logger.warn(
              `Erro ao processar pagável (batch ${batchId}), tentativa ${retryCount + 1}/${MAX_RETRIES}: ${error.message}`,
            );

            await this.rabbitmqService.publish(PAYABLE_QUEUE, {
              ...content,
              retryCount: retryCount + 1,
            });
          } else {
            this.logger.error(
              `Pagável enviado para fila morta após ${MAX_RETRIES} tentativas (batch ${batchId}): ${error.message}`,
            );

            channel.publish(
              '',
              PAYABLE_DLQ,
              Buffer.from(
                JSON.stringify({
                  ...content,
                  error: error.message,
                  failedAt: new Date().toISOString(),
                }),
              ),
              { persistent: true },
            );

            tracker.failures++;
            tracker.processed++;
          }
        }

        await this.checkBatchCompletion(batchId, tracker);
      },
      { noAck: false },
    );

    this.logger.log(`Consumer da fila ${PAYABLE_QUEUE} iniciado`);
  }

  private async consumeDeadLetterQueue() {
    const channel = this.rabbitmqService.getChannel();

    await channel.consume(
      PAYABLE_DLQ,
      async (msg) => {
        if (!msg) return;

        const content = JSON.parse(msg.content.toString());

        this.logger.error(
          `Item na Fila Morta (batch ${content.batchId}): ${content.error}`,
        );

        await this.mailService.sendDeadLetterEmail(
          content.data,
          content.batchId,
          content.error,
        );

        channel.ack(msg);
      },
      { noAck: false },
    );

    this.logger.log(`Consumer da fila morta ${PAYABLE_DLQ} iniciado`);
  }

  private getOrCreateTracker(batchId: string, totalItems: number): BatchTracker {
    if (!this.batchTrackers.has(batchId)) {
      this.batchTrackers.set(batchId, {
        totalItems,
        processed: 0,
        success: 0,
        failures: 0,
      });
    }
    return this.batchTrackers.get(batchId)!;
  }

  private async checkBatchCompletion(batchId: string, tracker: BatchTracker) {
    if (tracker.processed >= tracker.totalItems) {
      this.logger.log(
        `Lote ${batchId} finalizado: ${tracker.success} sucessos, ${tracker.failures} falhas`,
      );

      await this.mailService.sendBatchCompletedEmail(
        tracker.success,
        tracker.failures,
        batchId,
      );

      this.batchTrackers.delete(batchId);
    }
  }
}
