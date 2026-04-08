import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { CreateUserDto } from '@modules/users/application/dto/create-user.dto';
import { CreateUserUseCase } from '@modules/users/application/use-cases/create-user.use-case';
import { RequestWithUser } from '@modules/auth/infrastructure/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/shared/decorator/isPublic.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @Public()
  async create(@Body() createDto: CreateUserDto) {
    return await this.createUserUseCase.execute(createDto);
  }

  @Get('me')
  me(@Req() request: RequestWithUser) {
    return request.user;
  }
}
