import { Controller } from '@nestjs/common';
import { AssignorsService } from './assignors.service';

@Controller('assignors')
export class AssignorsController {
  constructor(private readonly assignorsService: AssignorsService) {}
}
