import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST ?? 'smtp.example.com',
      port: Number(process.env.MAIL_PORT) ?? 587,
      auth: {
        user: process.env.MAIL_USER ?? '',
        pass: process.env.MAIL_PASS ?? '',
      },
    });
  }

  async sendBatchCompletedEmail(
    success: number,
    failures: number,
    batchId: string,
  ): Promise<void> {
    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_FROM,
      subject: `Lote ${batchId} processado`,
      html: `
        <h1>Processamento do Lote ${batchId} Concluído</h1>
        <p><strong>Sucessos:</strong> ${success}</p>
        <p><strong>Falhas:</strong> ${failures}</p>
        <p>Total processado: ${success + failures}</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`E-mail de lote processado enviado para batch ${batchId}`);
    } catch (error: any) {
      this.logger.warn(
        `Falha ao enviar e-mail de lote processado (batch ${batchId}): ${error.message}`,
      );
    }
  }

  async sendDeadLetterEmail(
    payableData: Record<string, unknown>,
    batchId: string,
    errorMessage: string,
  ): Promise<void> {
    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_FROM,
      subject: `[OPERAÇÕES] Item do lote ${batchId} enviado para fila morta`,
      html: `
        <h1>Item Enviado para Fila Morta</h1>
        <p><strong>Batch ID:</strong> ${batchId}</p>
        <p><strong>Erro:</strong> ${errorMessage}</p>
        <p><strong>Dados do pagável:</strong></p>
        <pre>${JSON.stringify(payableData, null, 2)}</pre>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`E-mail de fila morta enviado para batch ${batchId}`);
    } catch (error: any) {
      this.logger.warn(
        `Falha ao enviar e-mail de fila morta (batch ${batchId}): ${error.message}`,
      );
    }
  }
}
