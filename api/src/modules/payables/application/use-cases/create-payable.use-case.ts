import { Injectable } from '@nestjs/common';
import { AssignorRepository } from '../../../assignors/domain/repository/assignor.repository';
import { PayableRepository } from '../../domain/repository/payable.repository';
import { CreatePayableDto } from '../dto/create-payable.dto';

@Injectable()
export class CreatePayableUseCase {
  constructor(
    private readonly assignorRepository: AssignorRepository,
    private readonly payableRepository: PayableRepository,
  ) {}

  async execute(dto: CreatePayableDto) {
    const assignor =
      (await this.assignorRepository.findByDocument(dto.assignor.document)) ??
      (await this.assignorRepository.create(dto.assignor));

    const payable = await this.payableRepository.create({
      value: dto.payable.value,
      emissionDate: new Date(dto.payable.emissionDate),
      assignorId: assignor.id,
    });

    return { payable, assignor };
  }
}
