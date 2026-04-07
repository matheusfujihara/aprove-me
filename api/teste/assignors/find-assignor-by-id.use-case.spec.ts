import { NotFoundException } from '@nestjs/common';
import { FindAssignorByIdUseCase } from '../../src/modules/assignors/application/use-cases/find-assignor-by-id.use-case';
import { AssignorRepository } from '../../src/modules/assignors/domain/repository/assignor.repository';
import { AssignorEntity } from '../../src/modules/assignors/domain/entities/assignors.entity';

describe('FindAssignorByIdUseCase', () => {
  let useCase: FindAssignorByIdUseCase;
  let repository: jest.Mocked<AssignorRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByDocument: jest.fn(),
    } as jest.Mocked<AssignorRepository>;

    useCase = new FindAssignorByIdUseCase(repository);
  });

  it('should return an assignor when found', async () => {
    const expected = new AssignorEntity({
      id: 'uuid-1',
      document: '12345678901',
      email: 'test@test.com',
      phone: '11999999999',
      name: 'Test Assignor',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    repository.findById.mockResolvedValue(expected);

    const result = await useCase.execute('uuid-1');

    expect(result).toEqual(expected);
    expect(repository.findById).toHaveBeenCalledWith('uuid-1');
  });

  it('should throw NotFoundException when assignor not found', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute('uuid-not-found')).rejects.toThrow(
      NotFoundException,
    );
  });
});
