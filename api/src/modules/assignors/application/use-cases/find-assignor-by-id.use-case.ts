import { Injectable, NotFoundException } from '@nestjs/common';
import { AssignorRepository } from '../../domain/repository/assignor.repository';
import { AssignorEntity } from '../../domain/entities/assignors.entity';

@Injectable()
export class FindAssignorByIdUseCase {
  constructor(private readonly assignorRepository: AssignorRepository) {}

  async execute(id: string): Promise<AssignorEntity> {
    const assignor = await this.assignorRepository.findById(id);
    if (!assignor) {
      throw new NotFoundException(`Cedente com id ${id} não encontrado`);
    }
    return assignor;
  }
}
