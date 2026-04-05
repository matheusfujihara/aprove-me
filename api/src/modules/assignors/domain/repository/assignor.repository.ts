import { AssignorEntity } from '../entities/assignors.entity';

export abstract class AssignorRepository {
  abstract create(
    data: Omit<AssignorEntity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<AssignorEntity>;
  abstract findById(id: string): Promise<AssignorEntity | null>;
  abstract update(
    id: string,
    data: Partial<AssignorEntity>,
  ): Promise<AssignorEntity>;
  abstract delete(id: string): Promise<void>;
  abstract findByDocument(document: string): Promise<AssignorEntity | null>;
}
