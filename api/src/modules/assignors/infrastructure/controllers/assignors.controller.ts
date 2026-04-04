import { AssignorsService } from '@modules/assignors/application/services/assignors.service';
import { Controller } from '@nestjs/common';

@Controller('assignors')
export class AssignorsController {
  constructor(private readonly assignorsService: AssignorsService) {}
}
