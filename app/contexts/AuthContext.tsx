'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/api/types/auth.types';
import { getUser } from '@/api/actions/auth.actions';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userData = await getUser();
      setUser(userData);
      
      if (!userData) {
        // Redirect to login if not authenticated
        router.push('/auth/login');
      }
    } catch (err) {
      setError('Failed to authenticate');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 