import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'test@test.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    example: 'P@ssw0rd',
  })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
