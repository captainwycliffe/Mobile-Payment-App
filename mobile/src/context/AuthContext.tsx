import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User, SignupRequest, LoginRequest } from '@types/auth';
import { AuthAPI } from '@services/api/authApi';
import { SecureStorage } from '@services/storage/secureStorage';

interface AuthContextType extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: { user: User; token: string } }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_ERROR'; payload: string };

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'CLEAR_USER':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const checkAuthStatus = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const [token, userData] = await Promise.all([
        SecureStorage.getAuthToken(),
        SecureStorage.getUserData(),
      ]);

      if (token && userData) {
        dispatch({ type: 'SET_USER', payload: { user: userData, token } });
      } else {
        dispatch({ type: 'CLEAR_USER' });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      dispatch({ type: 'CLEAR_USER' });
    }
  };

  const login = async (data: LoginRequest) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await AuthAPI.login(data);
      
      await Promise.all([
        SecureStorage.setAuthToken(response.token),
        SecureStorage.setUserData(response.user),
      ]);

      dispatch({ type: 'SET_USER', payload: response });
    } catch (error) {
      dispatch({ type: 'CLEAR_USER' });
      throw error;
    }
  };

  const signup = async (data: SignupRequest) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await AuthAPI.signup(data);
      
      await Promise.all([
        SecureStorage.setAuthToken(response.token),
        SecureStorage.setUserData(response.user),
      ]);

      dispatch({ type: 'SET_USER', payload: response });
    } catch (error) {
      dispatch({ type: 'CLEAR_USER' });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await SecureStorage.removeAuthData();
      dispatch({ type: 'CLEAR_USER' });
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear the user state even if storage clearing fails
      dispatch({ type: 'CLEAR_USER' });
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
