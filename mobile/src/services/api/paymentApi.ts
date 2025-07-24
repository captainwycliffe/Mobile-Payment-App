import { apiClient } from './apiClient';
import { SendPaymentRequest, SendPaymentResponse } from '@types/payment';

export class PaymentAPI {
  static async sendPayment(data: SendPaymentRequest): Promise<SendPaymentResponse> {
    const response = await apiClient.post<{
      status: string;
      message: string;
      data: SendPaymentResponse;
    }>('/send', data);
    
    return response.data;
  }
}