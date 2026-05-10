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
      // login() triggers onAuthStateChange → setUser in useAuth hook.
      // The dashboard layout guards against unauthenticated access,
      // so we can navigate immediately — it will render the loading
      // spinner until the profile resolves.
      router.push('/dashboard');
    } catch (e: any) {
      setError(e.message || 'Login failed. Check your email and password.');
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {error && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 16px',
          fontSize: '0.875rem',
          color: '#B91C1C',
        }}>
          {error}
        </div>
      )}

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="your@email.com"
        autoComplete="email"
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="••••••••"
        autoComplete="current-password"
      />

      <Button variant="primary" size="lg" fullWidth onClick={handleSubmit} loading={loading}>
        Sign In
      </Button>

      {/* Role-specific sign-up paths */}
      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--color-ink-muted)', marginBottom: '4px' }}>
          New to ShiftLink? Sign up as:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <Link href="/signup?type=professional" style={{
            display: 'block',
            textAlign: 'center',
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            fontSize: '0.8125rem',
            color: 'var(--color-ink)',
            fontWeight: 500,
            background: 'var(--color-cream)',
            transition: 'border-color 0.15s',
          }}>
            👩‍⚕️ Healthcare Professional
          </Link>
          <Link href="/signup?type=facility" style={{
            display: 'block',
            textAlign: 'center',
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            fontSize: '0.8125rem',
            color: 'var(--color-ink)',
            fontWeight: 500,
            background: 'var(--color-cream)',
            transition: 'border-color 0.15s',
          }}>
            🏥 Healthcare Facility
          </Link>
        </div>
      </div>
    </div>
  );
}
