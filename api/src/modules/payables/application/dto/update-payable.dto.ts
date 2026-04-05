import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class UpdatePayableDto {
  @ApiPropertyOptional({ example: 1500.75, description: 'Payable value' })
  @IsOptional()
  @IsNumber({}, { message: 'value must be a number' })
  value?: number;

  @ApiPropertyOptional({
    example: '2024-06-15',
    description: 'Emission date in ISO 8601 format',
  })
  @IsOptional()
  @IsDateString({}, { message: 'emissionDate must be a valid date' })
  emissionDate?: string;

  @ApiPropertyOptional({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Assignor UUID',
  })
  @IsOptional()
  @IsUUID('4', { message: 'assignorId must be a valid UUID' })
  assignorId?: string;
}
