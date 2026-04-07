import { Test, TestingModule } from '@nestjs/testing';
import { AssignorsController } from '../../src/modules/assignors/infrastructure/controllers/assignors.controller';
import { CreateAssignorUseCase } from '../../src/modules/assignors/application/use-cases/create-assignor.use-case';
import { FindAssignorByIdUseCase } from '../../src/modules/assignors/application/use-cases/find-assignor-by-id.use-case';
import { UpdateAssignorUseCase } from '../../src/modules/assignors/application/use-cases/update-assignor.use-case';
import { DeleteAssignorUseCase } from '../../src/modules/assignors/application/use-cases/delete-assignor.use-case';
import { FindAllAssignorsUseCase } from '../../src/modules/assignors/application/use-cases/find-all-assignors.use-case';
import { AssignorEntity } from '../../src/modules/assignors/domain/entities/assignors.entity';

describe('AssignorsController', () => {
  let controller: AssignorsController;
  let createUseCase: jest.Mocked<CreateAssignorUseCase>;
  let findByIdUseCase: jest.Mocked<FindAssignorByIdUseCase>;
  let updateUseCase: jest.Mocked<UpdateAssignorUseCase>;
  let deleteUseCase: jest.Mocked<DeleteAssignorUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignorsController],
      providers: [
        {
          provide: CreateAssignorUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: FindAssignorByIdUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: UpdateAssignorUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: DeleteAssignorUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: FindAllAssignorsUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AssignorsController>(AssignorsController);
    createUseCase = module.get(CreateAssignorUseCase);
    findByIdUseCase = module.get(FindAssignorByIdUseCase);
    updateUseCase = module.get(UpdateAssignorUseCase);
    deleteUseCase = module.get(DeleteAssignorUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an assignor', async () => {
      const dto = {
        document: '12345678901',
        email: 'test@test.com',
        phone: '11999999999',
        name: 'Test Assignor',
      };
      const expected = new AssignorEntity({ id: 'uuid-1', ...dto });
      createUseCase.execute.mockResolvedValue(expected);

      const result = await controller.create(dto);

      expect(result).toEqual(expected);
      expect(createUseCase.execute).toHaveBeenCalledWith(dto);
    });
  });

  describe('findById', () => {
    it('should return an assignor by id', async () => {
      const expected = new AssignorEntity({
        id: 'uuid-1',
        document: '12345678901',
        email: 'test@test.com',
        phone: '11999999999',
        name: 'Test',
      });
      findByIdUseCase.execute.mockResolvedValue(expected);

      const result = await controller.findById('uuid-1');

      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should update an assignor', async () => {
      const dto = { name: 'Updated' };
      const expected = new AssignorEntity({ id: 'uuid-1', name: 'Updated' });
      updateUseCase.execute.mockResolvedValue(expected);

      const result = await controller.update('uuid-1', dto);

      expect(result).toEqual(expected);
      expect(updateUseCase.execute).toHaveBeenCalledWith('uuid-1', dto);
    });
  });

  describe('remove', () => {
    it('should delete an assignor', async () => {
      deleteUseCase.execute.mockResolvedValue(undefined);

      await controller.remove('uuid-1');

      expect(deleteUseCase.execute).toHaveBeenCalledWith('uuid-1');
    });
  });
});
