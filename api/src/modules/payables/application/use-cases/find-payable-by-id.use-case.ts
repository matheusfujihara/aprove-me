import { Injectable, NotFoundException } from '@nestjs/common';
import { PayableRepository } from '../../domain/repository/payable.repository';
import { PayableEntity } from '../../domain/entities/payable.entity';

@Injectable()
export class FindPayableByIdUseCase {
  constructor(private readonly payableRepository: PayableRepository) {}

  async execute(id: string): Promise<PayableEntity> {
    const payable = await this.payableRepository.findById(id);
    if (!payable) {
      throw new NotFoundException(`Pagável com id ${id} não encontrado`);
    }
    return payable;
  }
}
