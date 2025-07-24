export interface SendPaymentRequest {
    recipient: string;
    amount: number;
    currency: string;
  }
  
  export interface SendPaymentResponse {
    transaction: Transaction;
  }