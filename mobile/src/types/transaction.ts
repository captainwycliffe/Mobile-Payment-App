export interface Transaction {
    id: number;
    recipient: string;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed';
    timestamp: string;
  }
  
  export interface TransactionListResponse {
    transactions: Transaction[];
    count: number;
  }