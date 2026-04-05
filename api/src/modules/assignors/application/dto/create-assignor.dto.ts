import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateAssignorDto {
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
    example: 'assignor@test.com',
    maxLength: 140,
    description: 'Assignor email',
  })
  @IsNotEmpty({ message: 'email is required' })
  @IsString({ message: 'email must be a string' })
  @MaxLength(140, { message: 'email must be at most 140 characters' })
  email: string;

  @ApiProperty({
    example: '11999999999',
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
