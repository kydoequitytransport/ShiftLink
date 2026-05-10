import { Suspense } from 'react';
import Link from 'next/link';
import { SignupForm } from '@/components/forms/SignupForm';

export const metadata = { title: 'Sign Up — ShiftLink' };

export default function SignupPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'stretch' }}>
      {/* Form panel */}
      <div style={{ flex: '1 1 480px', padding: 'clamp(32px, 6vw, 56px) clamp(20px, 5vw, 48px)', display: 'flex', flexDirection: 'column', maxWidth: '600px', width: '100%', margin: '0 auto' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-ink)', marginBottom: '40px', display: 'block' }}>
          Shift<em style={{ color: 'var(--color-sage)', fontStyle: 'italic' }}>Link</em>
        </Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 5vw, 2rem)', color: 'var(--color-ink)', marginBottom: '8px', lineHeight: 1.15 }}>
            Create your account.
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--color-ink-muted)', marginBottom: '36px', lineHeight: 1.7 }}>
            Already have an account?{' '}
            <Link href="/auth/login" style={{ color: 'var(--color-sage)', fontWeight: 500 }}>Sign in</Link>
          </p>
          <Suspense fallback={<div>Loading…</div>}>
            <SignupForm />
          </Suspense>
        </div>
      </div>

      {/* Decorative panel — hidden on mobile */}
      <div
        className="hidden md:flex"
        style={{ flex: '1 1 400px', background: 'var(--color-ink)', flexDirection: 'column', justifyContent: 'flex-end', padding: '48px', position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(92,122,110,0.3) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(196,101,74,0.15) 0%, transparent 50%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(246,243,238,0.4)', marginBottom: '16px' }}>Why ShiftLink</p>
          <blockquote style={{ fontFamily: 'var(--font-display)', fontSize: '1.625rem', lineHeight: 1.35, color: 'var(--color-cream)', marginBottom: '32px' }}>
            "I went from agency chaos to{' '}
            <em style={{ color: 'var(--color-sage)' }}>owning my schedule</em> in one week."
          </blockquote>
          <p style={{ fontSize: '0.875rem', color: 'rgba(246,243,238,0.6)' }}>— Dani R., ICU Nurse · Los Angeles</p>
        </div>
      </div>
    </div>
  );
}
