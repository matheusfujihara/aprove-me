import { PayableEntity } from '../entities/payable.entity';

export abstract class PayableRepository {
  abstract create(
    data: Omit<PayableEntity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<PayableEntity>;
  abstract findAll(): Promise<PayableEntity[]>;
  abstract findById(id: string): Promise<PayableEntity | null>;
  abstract update(
    id: string,
    data: Partial<PayableEntity>,
  ): Promise<PayableEntity>;
  abstract delete(id: string): Promise<void>;
}
