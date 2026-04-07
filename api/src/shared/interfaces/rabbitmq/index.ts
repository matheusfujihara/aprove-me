export interface PayableMessage {
  batchId: string;
  totalItems: number;
  retryCount: number;
  data: {
    payable: { value: number; emissionDate: string };
    assignor: { document: string; email: string; phone: string; name: string };
  };
}

export interface BatchTracker {
  totalItems: number;
  processed: number;
  success: number;
  failures: number;
}