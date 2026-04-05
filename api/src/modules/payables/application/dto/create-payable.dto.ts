import { ApiProperty } from '@nestjs/swagger';

class Receivable {
  id: string;
  value: number;
  emissionDate: string;
}

class Assignor {
  id: string;
  document: string;
  email: string;
  phone: string;
  name: string;
}

export class CreatePayableDto {
  receivable: Receivable;
  assignor: Assignor;
}
