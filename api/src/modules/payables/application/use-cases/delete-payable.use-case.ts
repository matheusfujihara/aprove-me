import { Injectable, NotFoundException } from '@nestjs/common';
import { PayableRepository } from '../../domain/repository/payable.repository';

@Injectable()
export class DeletePayableUseCase {
  constructor(private readonly payableRepository: PayableRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.payableRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Pagável com id ${id} não encontrado`);
    }
    await this.payableRepository.delete(id);
  }
}
