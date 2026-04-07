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
import { CreateAssignorUseCase } from '../../application/use-cases/create-assignor.use-case';
import { FindAssignorByIdUseCase } from '../../application/use-cases/find-assignor-by-id.use-case';
import { UpdateAssignorUseCase } from '../../application/use-cases/update-assignor.use-case';
import { DeleteAssignorUseCase } from '../../application/use-cases/delete-assignor.use-case';
import { CreateAssignorDto } from '../../application/dto/create-assignor.dto';
import { UpdateAssignorDto } from '../../application/dto/update-assignor.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FindAllAssignorsUseCase } from '../../application/use-cases/find-all-assignors.use-case';

@ApiBearerAuth()
@Controller('assignor')
export class AssignorsController {
  constructor(
    private readonly createAssignorUseCase: CreateAssignorUseCase,
    private readonly findAllAssignorsUseCase: FindAllAssignorsUseCase,
    private readonly findAssignorByIdUseCase: FindAssignorByIdUseCase,
    private readonly updateAssignorUseCase: UpdateAssignorUseCase,
    private readonly deleteAssignorUseCase: DeleteAssignorUseCase,
  ) {}

  @Get()
  async findAll() {
    return this.findAllAssignorsUseCase.execute();
  }

  @Post()
  async create(@Body() dto: CreateAssignorDto) {
    return this.createAssignorUseCase.execute(dto);
  }

  @Get(':id')
  async findById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.findAssignorByIdUseCase.execute(id);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateAssignorDto,
  ) {
    return this.updateAssignorUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.deleteAssignorUseCase.execute(id);
  }
}
