'use client';

import { useState, useEffect } from 'react';
import { AuthUser } from '@/lib/types';
import { supabase } from '@/lib/supabaseClient';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser({
          id: data.user.id,
          name: data.user.user_metadata?.name || '',
          email: data.user.email || '',
          type: data.user.user_metadata?.type || 'professional',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    getUser();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    console.log('[DEBUG] Supabase login response:', { data, error });
    if (data?.user) {
      setUser({
        id: data.user.id,
        name: data.user.user_metadata?.name || '',
        email: data.user.email || '',
        type: data.user.user_metadata?.type as import('@/lib/types').UserType || 'professional',
      });
      return data.user;
    }
    throw error;
  };

  const signup = async (payload: { email: string; password: string; name: string; type: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: { data: { name: payload.name, type: payload.type } },
    });
    if (data?.user) {
      setUser({
        id: data.user.id,
        name: payload.name,
        email: payload.email,
        type: payload.type as import('@/lib/types').UserType,
      });
      return data.user;
    }
    throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return { user, loading, login, signup, logout };
}
