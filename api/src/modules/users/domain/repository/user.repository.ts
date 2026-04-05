import { UserEntity } from '../entities/user.entity';

export abstract class UserRepository {
  abstract create(
    data: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<UserEntity>;
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
}
