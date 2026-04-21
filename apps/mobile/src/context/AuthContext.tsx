import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { API_BASE_URL } from '../api/config';

// Fallback memory storage to prevent Expo Go native module crashes
let _token: string | null = null;
export const MemoryStorage = {
  getItem: async (key: string) => _token,
  setItem: async (key: string, val: string) => { _token = val; },
  removeItem: async (key: string) => { _token = null; }
};

interface User {
  id: string;
  name?: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (v: string | null) => void;
  logout: () => Promise<void>;
  checkToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const storedToken = await MemoryStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        const res = await fetch(`${API_BASE_URL}/profile`, { 
            headers: { Authorization: `Bearer ${storedToken}` } 
        });
        if (res.ok) {
           const data = await res.json();
           setUser(data.user);
        } else {
           await MemoryStorage.removeItem('token');
           setToken(null);
        }
      }
    } catch(e) {}
  };

  const logout = async () => {
    await MemoryStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, setUser, setToken, logout, checkToken }}>
      {children}
    </AuthContext.Provider>
  );
};
