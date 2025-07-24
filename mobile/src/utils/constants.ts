import { Platform } from 'react-native';

// Simple localhost for web testing
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'
  : 'https://your-production-api.com/api';

export const USER_ROLES = {
  PSP: 'psp' as const,
  DEV: 'dev' as const,
};

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'] as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  USER_DATA: '@user_data',
} as const;

export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',
  background: '#F2F2F7',
  surface: '#FFFFFF',
  text: '#000000',
  textSecondary: '#6D6D80',
  border: '#C6C6C8',
  placeholder: '#8E8E93',
} as const;