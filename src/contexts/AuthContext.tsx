import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '../lib/api';

interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setLoading(false);
      return;
    }

    api.auth.me()
      .then(({ user }) => setUser(user))
      .catch(() => {
        localStorage.removeItem('auth_token');
      })
      .finally(() => setLoading(false));
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { token, user } = await api.auth.login(email, password);
      localStorage.setItem('auth_token', token);
      setUser(user);
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signOut = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
