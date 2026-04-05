import { Injectable, NotFoundException } from '@nestjs/common';
import { AssignorRepository } from '../../domain/repository/assignor.repository';
import { UpdateAssignorDto } from '../dto/update-assignor.dto';
import { AssignorEntity } from '../../domain/entities/assignors.entity';

@Injectable()
export class UpdateAssignorUseCase {
  constructor(private readonly assignorRepository: AssignorRepository) {}

  async execute(id: string, dto: UpdateAssignorDto): Promise<AssignorEntity> {
    const existing = await this.assignorRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Cedente com id ${id} não encontrado`);
    }
    return this.assignorRepository.update(id, dto);
  }
}
