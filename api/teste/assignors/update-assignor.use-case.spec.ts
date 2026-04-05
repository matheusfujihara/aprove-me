import { NotFoundException } from '@nestjs/common';
import { UpdateAssignorUseCase } from '../../src/modules/assignors/application/use-cases/update-assignor.use-case';
import { AssignorRepository } from '../../src/modules/assignors/domain/repository/assignor.repository';
import { AssignorEntity } from '../../src/modules/assignors/domain/entities/assignors.entity';

describe('UpdateAssignorUseCase', () => {
  let useCase: UpdateAssignorUseCase;
  let repository: jest.Mocked<AssignorRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<AssignorRepository>;

    useCase = new UpdateAssignorUseCase(repository);
  });

  it('should update an assignor when found', async () => {
    const existing = new AssignorEntity({
      id: 'uuid-1',
      document: '12345678901',
      email: 'test@test.com',
      phone: '11999999999',
      name: 'Test Assignor',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const updated = new AssignorEntity({
      ...existing,
      name: 'Updated Name',
    });

    repository.findById.mockResolvedValue(existing);
    repository.update.mockResolvedValue(updated);

    const result = await useCase.execute('uuid-1', { name: 'Updated Name' });

    expect(result).toEqual(updated);
    expect(repository.findById).toHaveBeenCalledWith('uuid-1');
    expect(repository.update).toHaveBeenCalledWith('uuid-1', {
      name: 'Updated Name',
    });
  });

  it('should throw NotFoundException when assignor not found', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute('uuid-not-found', { name: 'Updated' }),
    ).rejects.toThrow(NotFoundException);
  });
});
