import { Test, TestingModule } from '@nestjs/testing';
import { PayablesController } from '../../src/modules/payables/infrastructure/controllers/payables.controller';
import { CreatePayableUseCase } from '../../src/modules/payables/application/use-cases/create-payable.use-case';
import { FindPayableByIdUseCase } from '../../src/modules/payables/application/use-cases/find-payable-by-id.use-case';
import { UpdatePayableUseCase } from '../../src/modules/payables/application/use-cases/update-payable.use-case';
import { DeletePayableUseCase } from '../../src/modules/payables/application/use-cases/delete-payable.use-case';
import { FindAllPayablesUseCase } from '../../src/modules/payables/application/use-cases/find-all-payables.use-case';
import { BatchPayableUseCase } from '../../src/modules/payables/application/use-cases/batch-payable.use-case';
import { RabbitmqService } from '../../src/config/rabbitmq/rabbitmq.service';
import { AssignorEntity } from '../../src/modules/assignors/domain/entities/assignors.entity';
import { PayableEntity } from '../../src/modules/payables/domain/entities/payable.entity';

describe('PayablesController', () => {
  let controller: PayablesController;
  let createUseCase: jest.Mocked<CreatePayableUseCase>;
  let findByIdUseCase: jest.Mocked<FindPayableByIdUseCase>;
  let updateUseCase: jest.Mocked<UpdatePayableUseCase>;
  let deleteUseCase: jest.Mocked<DeletePayableUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayablesController],
      providers: [
        {
          provide: CreatePayableUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: FindPayableByIdUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: UpdatePayableUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: DeletePayableUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: FindAllPayablesUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: BatchPayableUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: RabbitmqService,
          useValue: { publish: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<PayablesController>(PayablesController);
    createUseCase = module.get(CreatePayableUseCase);
    findByIdUseCase = module.get(FindPayableByIdUseCase);
    updateUseCase = module.get(UpdatePayableUseCase);
    deleteUseCase = module.get(DeletePayableUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a payable and assignor', async () => {
      const dto = {
        payable: { value: 100.5, emissionDate: '2024-01-01' },
        assignor: {
          document: '12345678901',
          email: 'test@test.com',
          phone: '11999999999',
          name: 'Test',
        },
      };

      const expected = {
        assignor: new AssignorEntity({ id: 'a-uuid', ...dto.assignor }),
        payable: new PayableEntity({
          id: 'r-uuid',
          value: 100.5,
          emissionDate: new Date('2024-01-01'),
          assignorId: 'a-uuid',
        }),
      };

      createUseCase.execute.mockResolvedValue(expected);

      const result = await controller.create(dto);

      expect(result).toEqual(expected);
      expect(createUseCase.execute).toHaveBeenCalledWith(dto);
    });
  });

  describe('findById', () => {
    it('should return a payable by id', async () => {
      const expected = new PayableEntity({
        id: 'uuid-1',
        value: 100.5,
        emissionDate: new Date('2024-01-01'),
        assignorId: 'assignor-uuid',
      });
      findByIdUseCase.execute.mockResolvedValue(expected);

      const result = await controller.findById('uuid-1');

      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should update a payable', async () => {
      const dto = { value: 200 };
      const expected = new PayableEntity({ id: 'uuid-1', value: 200 });
      updateUseCase.execute.mockResolvedValue(expected);

      const result = await controller.update('uuid-1', dto);

      expect(result).toEqual(expected);
      expect(updateUseCase.execute).toHaveBeenCalledWith('uuid-1', dto);
    });
  });

  describe('remove', () => {
    it('should delete a payable', async () => {
      deleteUseCase.execute.mockResolvedValue(undefined);

      await controller.remove('uuid-1');

      expect(deleteUseCase.execute).toHaveBeenCalledWith('uuid-1');
    });
  });
});
