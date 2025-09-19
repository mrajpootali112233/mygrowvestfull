'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthResponse } from '@/types';
import apiService from '@/lib/api';
import { mockApiResponses, useMockApi } from '@/mocks/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, password: string, referralCode?: string) => Promise<AuthResponse>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      let response: AuthResponse;
      
      if (useMockApi) {
        // Use mock data for development
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        response = email.includes('admin') 
          ? mockApiResponses.adminLogin 
          : mockApiResponses.login;
      } else {
        response = await apiService.login(email, password);
      }

      // Store tokens and user data
      localStorage.setItem('accessToken', response.accessToken);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(response.user));

      setUser(response.user as User);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, referralCode?: string): Promise<AuthResponse> => {
    try {
      let response: AuthResponse;
      
      if (useMockApi) {
        // Use mock data for development
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        response = mockApiResponses.register;
      } else {
        response = await apiService.register(email, password, referralCode);
      }

      // Store tokens and user data
      localStorage.setItem('accessToken', response.accessToken);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(response.user));

      setUser(response.user as User);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};