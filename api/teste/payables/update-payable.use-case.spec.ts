import { NotFoundException } from '@nestjs/common';
import { UpdatePayableUseCase } from '../../src/modules/payables/application/use-cases/update-payable.use-case';
import { PayableRepository } from '../../src/modules/payables/domain/repository/payable.repository';
import { PayableEntity } from '../../src/modules/payables/domain/entities/payable.entity';

describe('UpdatePayableUseCase', () => {
  let useCase: UpdatePayableUseCase;
  let repository: jest.Mocked<PayableRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<PayableRepository>;

    useCase = new UpdatePayableUseCase(repository);
  });

  it('should update a payable when found', async () => {
    const existing = new PayableEntity({
      id: 'uuid-1',
      value: 100.5,
      emissionDate: new Date('2024-01-01'),
      assignorId: 'assignor-uuid',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const updated = new PayableEntity({
      ...existing,
      value: 200,
    });

    repository.findById.mockResolvedValue(existing);
    repository.update.mockResolvedValue(updated);

    const result = await useCase.execute('uuid-1', { value: 200 });

    expect(result).toEqual(updated);
    expect(repository.findById).toHaveBeenCalledWith('uuid-1');
    expect(repository.update).toHaveBeenCalledWith('uuid-1', { value: 200 });
  });

  it('should convert emissionDate string to Date', async () => {
    const existing = new PayableEntity({
      id: 'uuid-1',
      value: 100.5,
      emissionDate: new Date('2024-01-01'),
      assignorId: 'assignor-uuid',
    });

    repository.findById.mockResolvedValue(existing);
    repository.update.mockResolvedValue(existing);

    await useCase.execute('uuid-1', { emissionDate: '2024-06-15' });

    expect(repository.update).toHaveBeenCalledWith('uuid-1', {
      emissionDate: new Date('2024-06-15'),
    });
  });

  it('should throw NotFoundException when payable not found', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute('uuid-not-found', { value: 200 }),
    ).rejects.toThrow(NotFoundException);
  });
});
