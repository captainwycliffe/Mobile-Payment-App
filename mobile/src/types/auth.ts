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