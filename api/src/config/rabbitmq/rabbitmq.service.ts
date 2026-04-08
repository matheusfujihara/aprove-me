import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import * as amqplib from 'amqplib';
import {
  PAYABLE_DLQ,
  PAYABLE_DLX,
  PAYABLE_EXCHANGE,
  PAYABLE_QUEUE,
} from 'src/shared/const/rabbitmq';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private connection: amqplib.ChannelModel;
  private channel: amqplib.Channel;
  private readonly logger = new Logger(RabbitmqService.name);

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
  }

  private async connect() {
    const url = process.env.RABBITMQ_URL!;
    this.connection = await amqplib.connect(url);
    this.channel = await this.connection.createChannel();

    await this.channel.assertExchange(PAYABLE_DLX, 'direct', { durable: true });
    await this.channel.assertQueue(PAYABLE_DLQ, { durable: true });
    await this.channel.bindQueue(PAYABLE_DLQ, PAYABLE_DLX, PAYABLE_QUEUE);

    await this.channel.assertExchange(PAYABLE_EXCHANGE, 'direct', {
      durable: true,
    });
    await this.channel.assertQueue(PAYABLE_QUEUE, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': PAYABLE_DLX,
        'x-dead-letter-routing-key': PAYABLE_QUEUE,
      },
    });
    await this.channel.bindQueue(
      PAYABLE_QUEUE,
      PAYABLE_EXCHANGE,
      PAYABLE_QUEUE,
    );

    this.logger.log('Connected to RabbitMQ');
  }

  getChannel(): amqplib.Channel {
    return this.channel;
  }

  async publish(queue: string, message: Record<string, unknown>) {
    this.channel.publish(
      PAYABLE_EXCHANGE,
      queue,
      Buffer.from(JSON.stringify(message)),
      { persistent: true },
    );
  }
}
