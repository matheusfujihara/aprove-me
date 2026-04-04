import { Module } from '@nestjs/common';
import { AssignorsController } from '@modules/assignors/infrastructure/controllers/assignors.controller';
import { AssignorsService } from '@modules/assignors/application/services/assignors.service';

@Module({
  controllers: [AssignorsController],
  providers: [AssignorsService],
})
export class AssignorsModule {}
