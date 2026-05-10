'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (e: any) {
      console.log('[DEBUG] Login error:', e);
      setError(e.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {error && (
        <div
          style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            fontSize: '0.875rem',
            color: '#B91C1C',
          }}
        >
          {error}
        </div>
      )}

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        autoComplete="email"
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        autoComplete="current-password"
      />

      <Button variant="primary" size="lg" fullWidth onClick={handleSubmit} loading={loading}>
        Sign In
      </Button>

      <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--color-ink-muted)' }}>
        Don't have an account?{' '}
        <Link href="/signup" style={{ color: 'var(--color-sage)', fontWeight: 500 }}>
          Sign up
        </Link>
      </p>

      {/* Only registered users can log in. */}
    </div>
  );
}
