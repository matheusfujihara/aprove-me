import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

class PayableDto {
  @ApiProperty({ example: 123.45, description: 'Payable value' })
  @IsNotEmpty({ message: 'value is required' })
  @IsNumber({}, { message: 'value must be a number' })
  value: number;

  @ApiProperty({
    example: '2026-04-04',
    description: 'Emission date in ISO 8601 format',
  })
  @IsNotEmpty({ message: 'emissionDate is required' })
  @IsDateString({}, { message: 'emissionDate must be a valid date' })
  emissionDate: string;
}

class AssignorDto {
  @ApiProperty({
    example: '12345678901',
    maxLength: 30,
    description: 'Assignor CPF or CNPJ',
  })
  @IsNotEmpty({ message: 'document is required' })
  @IsString({ message: 'document must be a string' })
  @MaxLength(30, { message: 'document must be at most 30 characters' })
  document: string;

  @ApiProperty({
    example: 'teste@assignor.com',
    maxLength: 140,
    description: 'Assignor email',
  })
  @IsNotEmpty({ message: 'email is required' })
  @IsString({ message: 'email must be a string' })
  @MaxLength(140, { message: 'email must be at most 140 characters' })
  email: string;

  @ApiProperty({
    example: '42999999999',
    maxLength: 20,
    description: 'Assignor phone number',
  })
  @IsNotEmpty({ message: 'phone is required' })
  @IsString({ message: 'phone must be a string' })
  @MaxLength(20, { message: 'phone must be at most 20 characters' })
  phone: string;

  @ApiProperty({
    example: 'Assignor Company LLC',
    maxLength: 140,
    description: 'Assignor name',
  })
  @IsNotEmpty({ message: 'name is required' })
  @IsString({ message: 'name must be a string' })
  @MaxLength(140, { message: 'name must be at most 140 characters' })
  name: string;
}

export class CreatePayableDto {
  @ApiProperty({ type: PayableDto, description: 'Payable data' })
  @IsNotEmpty({ message: 'payable is required' })
  @ValidateNested()
  @Type(() => PayableDto)
  payable: PayableDto;

  @ApiProperty({ type: AssignorDto, description: 'Assignor data' })
  @IsNotEmpty({ message: 'assignor is required' })
  @ValidateNested()
  @Type(() => AssignorDto)
  assignor: AssignorDto;
}
