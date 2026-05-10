'use client';

import { useState, useEffect } from 'react';
import { AuthUser } from '@/lib/types';
import { supabase } from '@/lib/supabaseClient';

// Patch: fetch from professionals table using profile_id
async function buildUser(userId: string, email: string): Promise<AuthUser | null> {
  // Try professionals first
  let { data, error } = await supabase
    .from('professionals')
    .select('name, role')
    .eq('profile_id', userId)
    .single();
  if (!error && data) {
    return {
      id: userId,
      name: data.name || '',
      email,
      type: 'professional',
    };
  }
  // Optionally: fallback to facilities if needed
  ({ data, error } = await supabase
    .from('facilities')
    .select('contact_name')
    .eq('profile_id', userId)
    .single());
  if (!error && data) {
    return {
      id: userId,
      name: data.name || '',
      email,
      type: 'facility',
    };
  }
  return null;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let finished = false;
    const timeout = setTimeout(() => {
      if (!finished) {
        console.error('[useAuth] Hydration timed out');
        setLoading(false);
      }
    }, 10000);
    // Hydrate from existing session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        console.log('[useAuth] Found session, fetching user...');
        const u = await buildUser(session.user.id, session.user.email ?? '');
        setUser(u ?? null);
        console.log('[useAuth] User hydrated:', u);
      } else {
        setUser(null);
        console.log('[useAuth] No session found');
      }
      finished = true;
      clearTimeout(timeout);
      setLoading(false);
    });

    // Keep in sync with auth state changes (login / logout / token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          console.log('[useAuth] Auth state change: user found');
          const u = await buildUser(session.user.id, session.user.email ?? '');
          setUser(u ?? null);
          console.log('[useAuth] User hydrated (auth change):', u);
        } else {
          setUser(null);
          console.log('[useAuth] Auth state change: no user');
        }
        finished = true;
        clearTimeout(timeout);
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
