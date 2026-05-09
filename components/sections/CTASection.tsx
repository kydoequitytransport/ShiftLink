import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function CTASection() {
  return (
    <section
      style={{
        background: 'var(--color-ink)',
        padding: '80px 24px',
      }}
    >
      <div
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(246,243,238,0.4)',
            marginBottom: '20px',
          }}
        >
          Start Today
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            lineHeight: 1.1,
            color: 'var(--color-cream)',
            marginBottom: '24px',
          }}
        >
          Your next shift is
          <br />
          <em style={{ color: 'var(--color-sage)', fontStyle: 'italic' }}>waiting for you.</em>
        </h2>
        <p
          style={{
            fontSize: '0.9375rem',
            color: 'rgba(246,243,238,0.6)',
            lineHeight: 1.75,
            marginBottom: '40px',
            fontWeight: 300,
          }}
        >
          Join thousands of healthcare professionals who've taken
          control of their schedule with ShiftLink.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/signup?type=professional">
            <Button
              size="lg"
              style={{
                background: 'var(--color-sage)',
                color: 'white',
              }}
            >
              Join as a Professional
            </Button>
          </Link>
          <Link href="/signup?type=facility">
            <Button
              size="lg"
              style={{
                background: 'transparent',
                color: 'var(--color-cream)',
                border: '1px solid rgba(255,255,255,0.25)',
              }}
            >
              I Represent a Facility
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
