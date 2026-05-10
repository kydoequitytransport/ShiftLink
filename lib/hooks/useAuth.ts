'use client';

import { useState, useEffect } from 'react';
import { AuthUser } from '@/lib/types';
// In-memory mock user
const mockUser = {
  id: '1',
  name: 'Kydo Solis',
  email: 'kydo@shiftlink.com',
  password: '123456789',
  type: 'professional' as import('../types').UserType,
};

// In-memory buildUser
async function buildUser(userId: string, email: string): Promise<AuthUser | null> {
  if (mockUser.id === userId && mockUser.email === email) {
    return { id: mockUser.id, name: mockUser.name, email: mockUser.email, type: mockUser.type };
  }
  return null;
}


export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate user from sessionStorage on mount
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? sessionStorage.getItem('mockUser') : null;
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    if (email === mockUser.email && password === mockUser.password) {
      const u = { id: mockUser.id, name: mockUser.name, email: mockUser.email, type: mockUser.type };
      setUser(u);
      if (typeof window !== 'undefined') sessionStorage.setItem('mockUser', JSON.stringify(u));
      return mockUser;
    }
    throw new Error('Invalid credentials');
  };

  const signup = async (payload: {
    email: string;
    password: string;
    name: string;
    type: string;
  }) => {
    throw new Error('Signup is disabled in mock mode.');
  };

  const logout = async () => {
    setUser(null);
    if (typeof window !== 'undefined') sessionStorage.removeItem('mockUser');
  };

  return { user, loading, login, signup, logout };
}
