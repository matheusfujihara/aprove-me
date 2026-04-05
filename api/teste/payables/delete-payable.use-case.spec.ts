import { NotFoundException } from '@nestjs/common';
import { DeletePayableUseCase } from '../../src/modules/payables/application/use-cases/delete-payable.use-case';
import { PayableRepository } from '../../src/modules/payables/domain/repository/payable.repository';
import { PayableEntity } from '../../src/modules/payables/domain/entities/payable.entity';

describe('DeletePayableUseCase', () => {
  let useCase: DeletePayableUseCase;
  let repository: jest.Mocked<PayableRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<PayableRepository>;

    useCase = new DeletePayableUseCase(repository);
  });

  it('should delete a payable when found', async () => {
    const existing = new PayableEntity({
      id: 'uuid-1',
      value: 100.5,
      emissionDate: new Date('2024-01-01'),
      assignorId: 'assignor-uuid',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    repository.findById.mockResolvedValue(existing);
    repository.delete.mockResolvedValue(undefined);

    await useCase.execute('uuid-1');

    expect(repository.findById).toHaveBeenCalledWith('uuid-1');
    expect(repository.delete).toHaveBeenCalledWith('uuid-1');
  });

  it('should throw NotFoundException when payable not found', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute('uuid-not-found')).rejects.toThrow(
      NotFoundException,
    );
  });
});
