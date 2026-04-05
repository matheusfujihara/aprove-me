import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '@modules/users/application/dto/create-user.dto';
import { CreateUserUseCase } from '@modules/users/application/use-cases/create-user.use-case';
import { LoginDto } from '@modules/users/application/dto/login.dto';
import { LoginUseCase } from '@modules/users/application/use-cases/login.use-case';
import { RequestWithUser } from '../guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/shared/decorator/isPublic.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post()
  @Public()
  async create(@Body() createDto: CreateUserDto) {
    return await this.createUserUseCase.execute(createDto);
  }

  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto) {
    return await this.loginUseCase.execute(loginDto);
  }

  @Get('me')
  async me(@Req() request: RequestWithUser) {
    return request.user;
  }
}
