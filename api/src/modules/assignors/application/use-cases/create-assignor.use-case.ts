import { BadRequestException, Injectable } from '@nestjs/common';
import { AssignorRepository } from '../../domain/repository/assignor.repository';
import { CreateAssignorDto } from '../dto/create-assignor.dto';
import { AssignorEntity } from '../../domain/entities/assignors.entity';

@Injectable()
export class CreateAssignorUseCase {
  constructor(private readonly assignorRepository: AssignorRepository) {}

  async execute(dto: CreateAssignorDto): Promise<AssignorEntity> {
    const assignor = await this.assignorRepository.findByDocument(dto.document);
    if (assignor) {
      throw new BadRequestException(
        `Assignor already found with [document] ${dto.document}`,
      );
    }
    return this.assignorRepository.create(dto);
  }
}
