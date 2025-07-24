// Navigation Types
export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
  };
  
  export type AuthStackParamList = {
    Login: undefined;
    Signup: undefined;
  };
  
  export type MainStackParamList = {
    Dashboard: undefined;
    SendPayment: undefined;
  };
  
  // Auth Types
  export interface User {
    id: number;
    email: string;
    role: 'psp' | 'dev';
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
  }
  
  export interface SignupRequest {
    email: string;
    password: string;
    role: 'psp' | 'dev';
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    user: User;
    token: string;
  }
  
  // Transaction Types
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
  
  // Payment Types
  export interface SendPaymentRequest {
    recipient: string;
    amount: number;
    currency: string;
  }
  
  export interface SendPaymentResponse {
    transaction: Transaction;
  }
  