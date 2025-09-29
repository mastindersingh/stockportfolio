import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getSession, loginRequest, logoutRequest } from '../api/auth';
import type { LoginPayload, UserSession } from '../types';

interface AuthContextValue {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hydrateSession = async () => {
      try {
        const session = await getSession();
        if (session.authenticated) {
          setUser(session);
        }
      } finally {
        setIsLoading(false);
      }
    };

    hydrateSession();
  }, []);

  const login = async (payload: LoginPayload) => {
    const authenticatedUser = await loginRequest(payload);
    setUser(authenticatedUser);
  };

  const logout = async () => {
    await logoutRequest();
    setUser(null);
  };

  const refresh = async () => {
    const session = await getSession();
    if (session.authenticated) {
      setUser(session);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
      refresh
    }),
    [user, isLoading, login, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
