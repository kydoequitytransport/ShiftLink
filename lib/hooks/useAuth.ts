'use client';

import { useState, useEffect } from 'react';
import { AuthUser } from '@/lib/types';
import { supabase } from '@/lib/supabaseClient';

async function buildUser(userId: string, email: string): Promise<AuthUser | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('full_name, user_type')
    .eq('id', userId)
    .single();
  if (error || !data) return null;
  return {
    id: userId,
    name: data.full_name || '',
    email,
    type: data.user_type,
  };
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hydrate from existing session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const u = await buildUser(session.user.id, session.user.email ?? '');
        setUser(u ?? null);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Keep in sync with auth state changes (login / logout / token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const u = await buildUser(session.user.id, session.user.email ?? '');
          setUser(u ?? null);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  };

  const signup = async (payload: {
    email: string;
    password: string;
    name: string;
    type: string;
  }) => {
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: { data: { full_name: payload.name, user_type: payload.type } },
    });
    if (error) throw error;
    if (!data.user) throw new Error('Signup failed');
    return data.user;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return { user, loading, login, signup, logout };
}
