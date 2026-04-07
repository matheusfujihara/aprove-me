import { CreatePayableUseCase } from '../../src/modules/payables/application/use-cases/create-payable.use-case';
import { AssignorRepository } from '../../src/modules/assignors/domain/repository/assignor.repository';
import { PayableRepository } from '../../src/modules/payables/domain/repository/payable.repository';
import { AssignorEntity } from '../../src/modules/assignors/domain/entities/assignors.entity';
import { PayableEntity } from '../../src/modules/payables/domain/entities/payable.entity';

describe('CreatePayableUseCase', () => {
  let useCase: CreatePayableUseCase;
  let assignorRepository: jest.Mocked<AssignorRepository>;
  let payableRepository: jest.Mocked<PayableRepository>;

  beforeEach(() => {
    assignorRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByDocument: jest.fn(),
    } as jest.Mocked<AssignorRepository>;

    payableRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<PayableRepository>;

    useCase = new CreatePayableUseCase(assignorRepository, payableRepository);
  });

  it('should create an assignor and a payable', async () => {
    const dto = {
      assignor: {
        document: '12345678901',
        email: 'test@test.com',
        phone: '11999999999',
        name: 'Test Assignor',
      },
      payable: {
        value: 100.5,
        emissionDate: '2024-01-01',
      },
    };

    const assignor = new AssignorEntity({
      id: 'assignor-uuid',
      ...dto.assignor,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const payable = new PayableEntity({
      id: 'payable-uuid',
      value: 100.5,
      emissionDate: new Date('2024-01-01'),
      assignorId: 'assignor-uuid',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    assignorRepository.create.mockResolvedValue(assignor);
    payableRepository.create.mockResolvedValue(payable);

    const result = await useCase.execute(dto);

    expect(result.assignor).toEqual(assignor);
    expect(result.payable).toEqual(payable);
    expect(assignorRepository.create).toHaveBeenCalledWith(dto.assignor);
    expect(payableRepository.create).toHaveBeenCalledWith({
      value: 100.5,
      emissionDate: new Date('2024-01-01'),
      assignorId: 'assignor-uuid',
    });
  });
});
