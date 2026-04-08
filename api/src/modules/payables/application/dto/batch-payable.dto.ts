import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { CreatePayableDto } from './create-payable.dto';

export class BatchPayableDto {
  @ApiProperty({
    type: [CreatePayableDto],
    description: 'Array de pagáveis para processamento em lote (máximo 10.000)',
  })
  @IsArray({ message: 'payables must be an array' })
  @ArrayMinSize(1, { message: 'payables must contain at least 1 item' })
  @ArrayMaxSize(10000, {
    message: 'payables must contain at most 10,000 items',
  })
  @ValidateNested({ each: true })
  @Type(() => CreatePayableDto)
  payables: CreatePayableDto[];
}
