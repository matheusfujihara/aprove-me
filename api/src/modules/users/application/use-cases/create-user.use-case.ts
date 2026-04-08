import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRepository } from '@modules/users/domain/repository/user.repository';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: CreateUserDto) {
    const userFound = await this.userRepository.findByEmail(dto.email)
    if (userFound) {
      throw new BadRequestException(`User already exists with [email] ${dto.email}`)
    }
    return await this.userRepository.create(dto);
  }
}
