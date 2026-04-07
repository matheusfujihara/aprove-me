import { NotFoundException } from '@nestjs/common';
import { FindPayableByIdUseCase } from '../../src/modules/payables/application/use-cases/find-payable-by-id.use-case';
import { PayableRepository } from '../../src/modules/payables/domain/repository/payable.repository';
import { PayableEntity } from '../../src/modules/payables/domain/entities/payable.entity';

describe('FindPayableByIdUseCase', () => {
  let useCase: FindPayableByIdUseCase;
  let repository: jest.Mocked<PayableRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<PayableRepository>;

    useCase = new FindPayableByIdUseCase(repository);
  });

  it('should return a payable when found', async () => {
    const expected = new PayableEntity({
      id: 'uuid-1',
      value: 100.5,
      emissionDate: new Date('2024-01-01'),
      assignorId: 'assignor-uuid',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    repository.findById.mockResolvedValue(expected);

    const result = await useCase.execute('uuid-1');

    expect(result).toEqual(expected);
    expect(repository.findById).toHaveBeenCalledWith('uuid-1');
  });

  it('should throw NotFoundException when payable not found', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute('uuid-not-found')).rejects.toThrow(
      NotFoundException,
    );
  });
});
