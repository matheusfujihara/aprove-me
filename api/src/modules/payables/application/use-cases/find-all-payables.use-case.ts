import { Injectable } from '@nestjs/common';
import { PayableRepository } from '../../domain/repository/payable.repository';
import { PayableEntity } from '../../domain/entities/payable.entity';

@Injectable()
export class FindAllPayablesUseCase {
  constructor(private readonly payableRepository: PayableRepository) {}

  async execute(): Promise<PayableEntity[]> {
    return this.payableRepository.findAll();
  }
}
