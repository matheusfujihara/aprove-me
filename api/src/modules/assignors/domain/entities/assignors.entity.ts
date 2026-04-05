export class AssignorEntity {
  id: string;
  document: string;
  email: string;
  phone: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  constructor(props: Partial<AssignorEntity>) {
    Object.assign(this, props);
  }
}
