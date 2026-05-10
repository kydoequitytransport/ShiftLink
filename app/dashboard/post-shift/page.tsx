'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { PostShiftForm } from '@/components/forms/PostShiftForm';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PostShiftPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && user.type !== 'facility') {
      router.replace('/dashboard/shifts');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <div style={{ padding: 'clamp(24px, 5vw, 40px) clamp(16px, 4vw, 32px)' }}>
      <div style={{ maxWidth: '560px' }}>
        <p style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-sage)', marginBottom: '6px' }}>Facility</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 5vw, 1.875rem)', color: 'var(--color-ink)', lineHeight: 1.15, marginBottom: '8px' }}>Post a Shift</h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--color-ink-muted)', lineHeight: 1.7, marginBottom: '32px' }}>
          Fill in the details below. Your shift will go live on the board immediately after posting.
        </p>
        <div style={{ background: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'clamp(24px, 4vw, 36px)', boxShadow: 'var(--shadow-card)' }}>
          <PostShiftForm userId={user.id}/>
        </div>
      </div>
    </div>
  );
}
