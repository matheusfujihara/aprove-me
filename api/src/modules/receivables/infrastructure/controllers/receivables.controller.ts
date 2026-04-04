import { ReceivablesService } from '@modules/receivables/application/services/receivables.service';
import { Controller } from '@nestjs/common';

@Controller('receivables')
export class ReceivablesController {
  constructor(private readonly receivablesService: ReceivablesService) {}
}
