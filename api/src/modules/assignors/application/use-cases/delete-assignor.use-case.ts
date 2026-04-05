import { Injectable, NotFoundException } from '@nestjs/common';
import { AssignorRepository } from '../../domain/repository/assignor.repository';

@Injectable()
export class DeleteAssignorUseCase {
  constructor(private readonly assignorRepository: AssignorRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.assignorRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Cedente com id ${id} não encontrado`);
    }
    await this.assignorRepository.delete(id);
  }
}
