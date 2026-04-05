import { Injectable, NotFoundException } from '@nestjs/common';
import { PayableRepository } from '../../domain/repository/payable.repository';
import { UpdatePayableDto } from '../dto/update-payable.dto';
import { PayableEntity } from '../../domain/entities/payable.entity';

@Injectable()
export class UpdatePayableUseCase {
  constructor(private readonly payableRepository: PayableRepository) {}

  async execute(id: string, dto: UpdatePayableDto): Promise<PayableEntity> {
    const existing = await this.payableRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Pagável com id ${id} não encontrado`);
    }

    const data: Record<string, unknown> = {};
    if (dto.value !== undefined) data.value = dto.value;
    if (dto.emissionDate !== undefined)
      data.emissionDate = new Date(dto.emissionDate);
    if (dto.assignorId !== undefined) data.assignorId = dto.assignorId;

    return this.payableRepository.update(id, data);
  }
}
