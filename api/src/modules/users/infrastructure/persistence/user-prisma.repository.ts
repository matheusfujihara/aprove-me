import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../config/database/prisma.service';
import { UserRepository } from '@modules/users/domain/repository/user.repository';
import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { hash } from 'bcryptjs';

@Injectable()
export class UserPrismaRepository extends UserRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(
    data: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<UserEntity> {
    const hashedPassword = await hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: { ...data, password: hashedPassword },
    });
    return new UserEntity(user);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
    return user ? new UserEntity(user) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
    return user ? new UserEntity(user) : null;
  }
}
