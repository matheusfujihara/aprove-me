import { NotFoundException } from '@nestjs/common';
import { DeleteAssignorUseCase } from '../../src/modules/assignors/application/use-cases/delete-assignor.use-case';
import { AssignorRepository } from '../../src/modules/assignors/domain/repository/assignor.repository';
import { AssignorEntity } from '../../src/modules/assignors/domain/entities/assignors.entity';

describe('DeleteAssignorUseCase', () => {
  let useCase: DeleteAssignorUseCase;
  let repository: jest.Mocked<AssignorRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<AssignorRepository>;

    useCase = new DeleteAssignorUseCase(repository);
  });

  it('should delete an assignor when found', async () => {
    const existing = new AssignorEntity({
      id: 'uuid-1',
      document: '12345678901',
      email: 'test@test.com',
      phone: '11999999999',
      name: 'Test Assignor',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    repository.findById.mockResolvedValue(existing);
    repository.delete.mockResolvedValue(undefined);

    await useCase.execute('uuid-1');

    expect(repository.findById).toHaveBeenCalledWith('uuid-1');
    expect(repository.delete).toHaveBeenCalledWith('uuid-1');
  });

  it('should throw NotFoundException when assignor not found', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute('uuid-not-found')).rejects.toThrow(
      NotFoundException,
    );
  });
});
