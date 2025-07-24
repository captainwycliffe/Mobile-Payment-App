import React, { createContext, useContext, ReactNode } from 'react';
import Toast from 'react-native-toast-message';

interface ToastContextType {
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  showRoleBasedToast: (role: 'psp' | 'dev') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const showSuccess = (message: string, title = 'Success') => {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
      visibilityTime: 3000,
      autoHide: true,
    });
  };

  const showError = (message: string, title = 'Error') => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
      visibilityTime: 4000,
      autoHide: true,
    });
  };

  const showInfo = (message: string, title = 'Info') => {
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
      visibilityTime: 3000,
      autoHide: true,
    });
  };

  const showRoleBasedToast = (role: 'psp' | 'dev') => {
    if (role === 'psp') {
      const merchantCount = Math.floor(Math.random() * 50) + 10; // Mock 10-60 merchants
      showInfo(`You have ${merchantCount} merchants connected`, 'PSP Dashboard');
    } else if (role === 'dev') {
      const apiCalls = Math.floor(Math.random() * 5000) + 1000; // Mock 1000-6000 calls
      showInfo(`You've made ${apiCalls.toLocaleString()} API calls this week`, 'Developer Stats');
    }
  };

  const value: ToastContextType = {
    showSuccess,
    showError,
    showInfo,
    showRoleBasedToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};