import { Injectable } from '@nestjs/common';
import { AssignorRepository } from '../../domain/repository/assignor.repository';
import { CreateAssignorDto } from '../dto/create-assignor.dto';
import { AssignorEntity } from '../../domain/entities/assignors.entity';

@Injectable()
export class CreateAssignorUseCase {
  constructor(private readonly assignorRepository: AssignorRepository) {}

  async execute(dto: CreateAssignorDto): Promise<AssignorEntity> {
    return this.assignorRepository.create(dto);
  }
}
