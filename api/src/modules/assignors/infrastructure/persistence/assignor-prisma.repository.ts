import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../config/database/prisma.service';
import { AssignorRepository } from '../../domain/repository/assignor.repository';
import { AssignorEntity } from '../../domain/entities/assignors.entity';

@Injectable()
export class AssignorPrismaRepository extends AssignorRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(
    data: Omit<AssignorEntity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<AssignorEntity> {
    const assignor = await this.prisma.assignor.create({ data });
    return new AssignorEntity(assignor);
  }

  async findById(id: string): Promise<AssignorEntity | null> {
    const assignor = await this.prisma.assignor.findFirst({
      where: { id, deletedAt: null },
    });
    return assignor ? new AssignorEntity(assignor) : null;
  }

  async update(
    id: string,
    data: Partial<AssignorEntity>,
  ): Promise<AssignorEntity> {
    const assignor = await this.prisma.assignor.update({
      where: { id },
      data,
    });
    return new AssignorEntity(assignor);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.assignor.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async findByDocument(document: string): Promise<AssignorEntity | null> {
    const assignor = await this.prisma.assignor.findFirst({
      where: { document, deletedAt: null },
    });
    return assignor ? new AssignorEntity(assignor) : null;
  }
}
