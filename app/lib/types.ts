export interface Assignor {
  id: string;
  document: string;
  email: string;
  phone: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Payable {
  id: string;
  value: number;
  emissionDate: string;
  assignorId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreatePayableResponse {
  payable: Payable;
  assignor: Assignor;
}

export interface LoginResponse {
  accessToken: string;
}
