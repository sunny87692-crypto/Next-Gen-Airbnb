'use client';

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { AuthPayload, AuthResponse, clearAuthToken, getAuthToken, loginUser, registerUser, setAuthToken } from './auth';

type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (payload: AuthPayload) => Promise<AuthResponse>;
  register: (payload: AuthPayload) => Promise<AuthResponse>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setToken(getAuthToken());
    setIsReady(true);
  }, []);

  const login = async (payload: AuthPayload) => {
    const result = await loginUser(payload);
    if (result.token) {
      setAuthToken(result.token);
      setToken(result.token);
    }
    return result;
  };

  const register = async (payload: AuthPayload) => {
    const result = await registerUser(payload);
    if (result.token) {
      setAuthToken(result.token);
      setToken(result.token);
    }
    return result;
  };

  const logout = () => {
    clearAuthToken();
    setToken(null);
  };

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      isReady,
      login,
      register,
      logout,
    }),
    [isReady, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
