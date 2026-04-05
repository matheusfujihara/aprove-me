import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateAssignorDto {
  @ApiPropertyOptional({
    example: '12345678901',
    maxLength: 30,
    description: 'Assignor CPF or CNPJ',
  })
  @IsOptional()
  @IsString({ message: 'document must be a string' })
  @MaxLength(30, { message: 'document must be at most 30 characters' })
  document?: string;

  @ApiPropertyOptional({
    example: 'assignor@company.com',
    maxLength: 140,
    description: 'Assignor email',
  })
  @IsOptional()
  @IsString({ message: 'email must be a string' })
  @MaxLength(140, { message: 'email must be at most 140 characters' })
  email?: string;

  @ApiPropertyOptional({
    example: '11999999999',
    maxLength: 20,
    description: 'Assignor phone number',
  })
  @IsOptional()
  @IsString({ message: 'phone must be a string' })
  @MaxLength(20, { message: 'phone must be at most 20 characters' })
  phone?: string;

  @ApiPropertyOptional({
    example: 'Assignor Company LLC',
    maxLength: 140,
    description: 'Assignor name',
  })
  @IsOptional()
  @IsString({ message: 'name must be a string' })
  @MaxLength(140, { message: 'name must be at most 140 characters' })
  name?: string;
}
