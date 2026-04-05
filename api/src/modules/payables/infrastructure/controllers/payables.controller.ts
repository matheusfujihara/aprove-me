import { PayablesService } from '@modules/payables/application/services/payables.service';
import { Controller, Get, Post } from '@nestjs/common';

@Controller('payables')
export class PayablesController {
  constructor(private readonly payablesService: PayablesService) {}

  @Post()
  async create() {
    return 'return payable';
  }
}
