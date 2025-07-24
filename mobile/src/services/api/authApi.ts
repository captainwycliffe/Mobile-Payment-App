import { apiClient } from './apiClient';
import { 
  SignupRequest, 
  LoginRequest, 
  AuthResponse 
} from '@types/auth';

export class AuthAPI {
  static async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await apiClient.post<{
      status: string;
      message: string;
      data: AuthResponse;
    }>('/auth/signup', data);
    
    return response.data;
  }

  static async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<{
      status: string;
      message: string;
      data: AuthResponse;
    }>('/auth/login', data);
    
    return response.data;
  }

  static async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post<{
      status: string;
      message: string;
      data: AuthResponse;
    }>('/auth/refresh');
    
    return response.data;
  }
}
