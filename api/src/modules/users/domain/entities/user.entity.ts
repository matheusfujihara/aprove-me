export class UserEntity {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  constructor(props: Partial<UserEntity>) {
    Object.assign(this, props);
  }
}
