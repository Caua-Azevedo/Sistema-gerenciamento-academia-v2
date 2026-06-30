import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getToken, setToken, clearToken, getApiErrorMessage } from '@/lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  type: 'student' | 'teacher' | 'admin';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, userType: 'student' | 'teacher') => Promise<void>;
  register: (name: string, email: string, password: string, userType: 'student' | 'teacher') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ao carregar a aplicação, valida o token salvo consultando a API
  useEffect(() => {
    const bootstrap = async () => {
      const token = getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
      } catch (error) {
        clearToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (email: string, password: string, _userType: 'student' | 'teacher') => {
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setToken(data.token);
      setUser(data.user);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Erro ao fazer login'));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, userType: 'student' | 'teacher') => {
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, password, type: userType });
      setToken(data.token);
      setUser(data.user);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Erro ao se registrar'));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    clearToken();
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
