import { Module } from '@nestjs/common';
import { AssignorsController } from './infrastructure/controllers/assignors.controller';
import { AssignorRepository } from './domain/repository/assignor.repository';
import { AssignorPrismaRepository } from './infrastructure/persistence/assignor-prisma.repository';
import { CreateAssignorUseCase } from './application/use-cases/create-assignor.use-case';
import { FindAssignorByIdUseCase } from './application/use-cases/find-assignor-by-id.use-case';
import { UpdateAssignorUseCase } from './application/use-cases/update-assignor.use-case';
import { DeleteAssignorUseCase } from './application/use-cases/delete-assignor.use-case';
import { FindAllAssignorsUseCase } from './application/use-cases/find-all-assignors.use-case';

@Module({
  controllers: [AssignorsController],
  providers: [
    {
      provide: AssignorRepository,
      useClass: AssignorPrismaRepository,
    },
    CreateAssignorUseCase,
    FindAllAssignorsUseCase,
    FindAssignorByIdUseCase,
    UpdateAssignorUseCase,
    DeleteAssignorUseCase,
  ],
  exports: [AssignorRepository],
})
export class AssignorsModule {}
