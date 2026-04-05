export class PayableEntity {
  id: string;
  value: number;
  emissionDate: Date;
  assignorId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  constructor(props: Partial<PayableEntity>) {
    Object.assign(this, props);
  }
}
