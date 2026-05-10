'use client';

import { useState, useEffect } from 'react';
import { AuthUser } from '@/lib/types';
import { supabase } from '@/lib/supabase/client';
import { fetchProfile, signIn, signOut, signUp, SignUpPayload } from '@/lib/supabase/auth.service';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Single source of truth: onAuthStateChange handles INITIAL_SESSION on mount
    // which fires synchronously with the persisted session — no getSession() race needed.
    let latestRequestId = 0;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const requestId = ++latestRequestId;
          try {
            const profile = await fetchProfile(session.user.id, session.user.email ?? '');
            // Only apply if this is still the latest request (avoid stale updates)
            if (requestId === latestRequestId) {
              setUser(profile);
              setLoading(false);
            }
          } catch {
            if (requestId === latestRequestId) {
              setUser(null);
              setLoading(false);
            }
          }
        } else {
          ++latestRequestId; // invalidate any in-flight fetch
          setUser(null);
          setLoading(false);
        }
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
