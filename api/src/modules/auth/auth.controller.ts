import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './application/dto/login.dto';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/shared/decorator/isPublic.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto) {
    return await this.loginUseCase.execute(loginDto);
  }
}
