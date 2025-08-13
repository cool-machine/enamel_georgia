import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<boolean>;
} | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({ user: null, isLoading: false });
  
  const login = async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Mock authentication - replace with real API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password) {
      const user: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'customer'
      };
      setState({ user, isLoading: false });
      return true;
    }
    
    setState(prev => ({ ...prev, isLoading: false }));
    return false;
  };
  
  const logout = () => {
    setState({ user: null, isLoading: false });
  };
  
  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Mock registration - replace with real API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password && name) {
      const user: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        role: 'customer'
      };
      setState({ user, isLoading: false });
      return true;
    }
    
    setState(prev => ({ ...prev, isLoading: false }));
    return false;
  };
  
  return (
    <AuthContext.Provider value={{ state, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};