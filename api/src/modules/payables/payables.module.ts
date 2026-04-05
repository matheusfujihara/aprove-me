import { Module } from '@nestjs/common';
import { PayablesController } from './infrastructure/controllers/payables.controller';
import { CreatePayableUseCase } from './application/use-cases/create-payable.use-case';
import { FindPayableByIdUseCase } from './application/use-cases/find-payable-by-id.use-case';
import { UpdatePayableUseCase } from './application/use-cases/update-payable.use-case';
import { DeletePayableUseCase } from './application/use-cases/delete-payable.use-case';
import { PayableRepository } from './domain/repository/payable.repository';
import { PayablePrismaRepository } from './infrastructure/persistence/payable-prisma.repository';
import { AssignorsModule } from '../assignors/assignors.module';

@Module({
  imports: [AssignorsModule],
  controllers: [PayablesController],
  providers: [
    {
      provide: PayableRepository,
      useClass: PayablePrismaRepository,
    },
    CreatePayableUseCase,
    FindPayableByIdUseCase,
    UpdatePayableUseCase,
    DeletePayableUseCase,
  ],
})
export class PayablesModule {}
