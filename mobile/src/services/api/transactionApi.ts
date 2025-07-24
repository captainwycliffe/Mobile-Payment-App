import { apiClient } from './apiClient';
import { TransactionListResponse } from '@types/transaction';

export class TransactionAPI {
  static async getTransactions(): Promise<TransactionListResponse> {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: TransactionListResponse;
    }>('/transactions');
    
    return response.data;
  }
}