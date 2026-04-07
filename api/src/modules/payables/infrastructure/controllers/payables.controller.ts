import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePayableUseCase } from '../../application/use-cases/create-payable.use-case';
import { FindPayableByIdUseCase } from '../../application/use-cases/find-payable-by-id.use-case';
import { UpdatePayableUseCase } from '../../application/use-cases/update-payable.use-case';
import { DeletePayableUseCase } from '../../application/use-cases/delete-payable.use-case';
import { CreatePayableDto } from '../../application/dto/create-payable.dto';
import { UpdatePayableDto } from '../../application/dto/update-payable.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FindAllPayablesUseCase } from '../../application/use-cases/find-all-payables.use-case';
import { BatchPayableDto } from '@modules/payables/application/dto/batch-payable.dto';
import { BatchPayableUseCase } from '@modules/payables/application/use-cases/batch-payable.use-case';

@ApiBearerAuth()
@Controller('payable')
export class PayablesController {
  constructor(
    private readonly createPayableUseCase: CreatePayableUseCase,
    private readonly findAllPayablesUseCase: FindAllPayablesUseCase,
    private readonly findPayableByIdUseCase: FindPayableByIdUseCase,
    private readonly updatePayableUseCase: UpdatePayableUseCase,
    private readonly deletePayableUseCase: DeletePayableUseCase,
    private readonly batchPayableUseCase: BatchPayableUseCase
  ) {}

  @Get()
  async findAll() {
    return this.findAllPayablesUseCase.execute();
  }

  @Post()
  async create(@Body() dto: CreatePayableDto) {
    return this.createPayableUseCase.execute(dto);
  }

  @Get(':id')
  async findById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.findPayableByIdUseCase.execute(id);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdatePayableDto,
  ) {
    return this.updatePayableUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.deletePayableUseCase.execute(id);
  }
  
  @Post('batch')
  async batch(@Body() dto: BatchPayableDto) {
    return this.batchPayableUseCase.execute(dto);
  }
}
