import { CreateAssignorUseCase } from '../../src/modules/assignors/application/use-cases/create-assignor.use-case';
import { AssignorRepository } from '../../src/modules/assignors/domain/repository/assignor.repository';
import { AssignorEntity } from '../../src/modules/assignors/domain/entities/assignors.entity';

describe('CreateAssignorUseCase', () => {
  let useCase: CreateAssignorUseCase;
  let repository: jest.Mocked<AssignorRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<AssignorRepository>;

    useCase = new CreateAssignorUseCase(repository);
  });

  it('should create an assignor', async () => {
    const dto = {
      document: '12345678901',
      email: 'test@test.com',
      phone: '11999999999',
      name: 'Test Assignor',
    };

    const expected = new AssignorEntity({
      id: 'uuid-1',
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    repository.create.mockResolvedValue(expected);

    const result = await useCase.execute(dto);

    expect(result).toEqual(expected);
    expect(repository.create).toHaveBeenCalledWith(dto);
  });
});
