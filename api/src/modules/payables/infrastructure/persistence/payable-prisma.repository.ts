import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../config/database/prisma.service';
import { PayableRepository } from '../../domain/repository/payable.repository';
import { PayableEntity } from '../../domain/entities/payable.entity';

@Injectable()
export class PayablePrismaRepository extends PayableRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(
    data: Omit<PayableEntity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<PayableEntity> {
    const payable = await this.prisma.payable.create({ data });
    return new PayableEntity(payable);
  }

  async findAll(): Promise<PayableEntity[]> {
    const payables = await this.prisma.payable.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    return payables.map((payable) => new PayableEntity(payable));
  }

  async findById(id: string): Promise<PayableEntity | null> {
    const payable = await this.prisma.payable.findFirst({
      where: { id, deletedAt: null },
    });
    return payable ? new PayableEntity(payable) : null;
  }

  async update(
    id: string,
    data: Partial<PayableEntity>,
  ): Promise<PayableEntity> {
    const payable = await this.prisma.payable.update({
      where: { id },
      data,
    });
    return new PayableEntity(payable);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.payable.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
