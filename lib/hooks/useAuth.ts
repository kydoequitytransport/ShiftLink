'use client';

import { useState, useEffect } from 'react';
import { AuthUser } from '@/lib/types';
import { supabase } from '@/lib/supabase/client';
import { fetchProfile, signIn, signOut, signUp, SignUpPayload } from '@/lib/supabase/auth.service';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id, session.user.email ?? '');
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          if (event === 'SIGNED_IN') await new Promise(r => setTimeout(r, 800));
          const profile = await fetchProfile(session.user.id, session.user.email ?? '');
          setUser(profile);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const authUser = await signIn(email, password);
    return authUser;
  };

  const logout = async () => {
    await signOut();
    setUser(null);
  };

  const register = async (payload: SignUpPayload) => {
    return await signUp(payload);
  };

  return { user, loading, login, logout, register };
}
