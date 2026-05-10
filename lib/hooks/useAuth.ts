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
    .select('name')
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

  // If user exists in Supabase Auth but not in professionals/facilities, auto-create minimal professionals row
  // (You can expand this logic for facilities if needed)
  if (email) {
    // Try to get user metadata from Supabase Auth
    const { data: userMeta } = await supabase.auth.admin.getUserById(userId);
    const name = userMeta?.user?.user_metadata?.full_name || email.split('@')[0];
    const role = 'Registered Nurse'; // Default/fallback
    const { error: insertErr } = await supabase.from('professionals').insert({
      profile_id: userId,
      name,
      email,
      role,
      license_number: '',
      years_of_experience: 0,
    });
    if (!insertErr) {
      // Try again to fetch
      let { data: newData, error: newError } = await supabase
        .from('professionals')
        .select('name, role')
        .eq('profile_id', userId)
        .single();
      if (!newError && newData) {
        return {
          id: userId,
          name: newData.name || '',
          email,
          type: 'professional',
        };
      }
    }
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
        setLoading(false);
        // Show error in UI if possible (global alert or similar)
        if (typeof window !== 'undefined') {
          window.alert('Login session found but no user profile exists. Please contact support.');
        }
      }
    }, 10000);
    // Hydrate from existing session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const u = await buildUser(session.user.id, session.user.email ?? '');
        setUser(u ?? null);
        if (!u && typeof window !== 'undefined') {
          window.alert('Login session found but no user profile exists. Please contact support.');
        }
      } else {
        setUser(null);
      }
      finished = true;
      clearTimeout(timeout);
      setLoading(false);
    });

    // Keep in sync with auth state changes (login / logout / token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const u = await buildUser(session.user.id, session.user.email ?? '');
          setUser(u ?? null);
          if (!u && typeof window !== 'undefined') {
            window.alert('Login session found but no user profile exists. Please contact support.');
          }
        } else {
          setUser(null);
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
