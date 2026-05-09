'use client';

import { useState, useEffect } from 'react';
import { AuthUser } from '@/lib/types';
import { MOCK_AUTH_USER } from '@/lib/mock-data/shifts';

const AUTH_KEY = 'shiftlink_auth';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(AUTH_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // session storage unavailable
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email: string, _password: string) => {
    // Mock auth — always succeeds
    const authUser: AuthUser = {
      ...MOCK_AUTH_USER,
      email,
    };
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
    setUser(authUser);
    return authUser;
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  return { user, loading, login, logout };
}
