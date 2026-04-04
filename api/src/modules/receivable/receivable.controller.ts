import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReceivableService } from './receivable.service';
import { CreateReceivableDto } from './dto/create-receivable.dto';
import { UpdateReceivableDto } from './dto/update-receivable.dto';

@Controller('receivable')
export class ReceivableController {
  constructor(private readonly receivableService: ReceivableService) {}

  @Post()
  create(@Body() createReceivableDto: CreateReceivableDto) {
    return this.receivableService.create(createReceivableDto);
  }

  @Get()
  findAll() {
    return this.receivableService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.receivableService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReceivableDto: UpdateReceivableDto) {
    return this.receivableService.update(+id, updateReceivableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.receivableService.remove(+id);
  }
}
