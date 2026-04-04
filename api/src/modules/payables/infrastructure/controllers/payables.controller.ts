import { PayablesService } from '@modules/payables/application/services/payables.service';
import { Controller } from '@nestjs/common';

@Controller('payables')
export class PayablesController {
  constructor(private readonly payablesService: PayablesService) {}
}
