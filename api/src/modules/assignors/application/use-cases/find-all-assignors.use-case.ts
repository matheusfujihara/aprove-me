import { Injectable } from '@nestjs/common';
import { AssignorRepository } from '../../domain/repository/assignor.repository';
import { AssignorEntity } from '../../domain/entities/assignors.entity';

@Injectable()
export class FindAllAssignorsUseCase {
  constructor(private readonly assignorRepository: AssignorRepository) {}

  async execute(): Promise<AssignorEntity[]> {
    return this.assignorRepository.findAll();
  }
}
