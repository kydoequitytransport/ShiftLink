import Link from 'next/link';
import { LoginForm } from '@/components/forms/LoginForm';

export const metadata = { title: 'Sign In — ShiftLink' };

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(24px, 5vw, 40px) 20px', background: 'var(--color-cream)' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-ink)', display: 'block', textAlign: 'center', marginBottom: '36px' }}>
          Shift<em style={{ color: 'var(--color-sage)', fontStyle: 'italic' }}>Link</em>
        </Link>
        <div style={{ background: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'clamp(28px, 5vw, 40px) clamp(24px, 5vw, 36px)', boxShadow: 'var(--shadow-elevated)' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.625rem', color: 'var(--color-ink)', marginBottom: '6px' }}>Welcome back.</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-muted)', marginBottom: '28px' }}>Sign in to your ShiftLink account.</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
