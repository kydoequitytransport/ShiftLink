import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  return (
    <section
      style={{
        padding: '96px var(--page-gutter) 80px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {/* Eyebrow */}
      <p
        style={{
          fontSize: '0.6875rem',
          fontWeight: 600,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--color-sage)',
          marginBottom: '24px',
        }}
      >
        Healthcare Staffing, Reimagined
      </p>

      {/* Headline */}
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          lineHeight: 1.08,
          letterSpacing: '-0.02em',
          color: 'var(--color-ink)',
          maxWidth: '820px',
          marginBottom: '28px',
        }}
      >
        The shift board for{' '}
        <em
          style={{
            color: 'var(--color-sage)',
            fontStyle: 'italic',
          }}
        >
          every
        </em>{' '}
        healthcare professional.
      </h1>

      {/* Subhead */}
      <p
        style={{
          fontSize: '1.0625rem',
          lineHeight: 1.75,
          color: 'var(--color-ink-muted)',
          maxWidth: '520px',
          marginBottom: '48px',
          fontWeight: 300,
        }}
      >
        ShiftLink connects credentialed nurses, techs, and aides with
        facilities that need coverage — tonight, this weekend, or next month.
        No agencies. No waiting.
      </p>

      {/* Dual CTA */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <Link href="/signup?type=professional">
          <Button variant="primary" size="lg">
            Find Shifts
          </Button>
        </Link>
        <Link href="/signup?type=facility">
          <Button variant="outline" size="lg">
            Post a Shift
          </Button>
        </Link>
      </div>

      {/* Trust signals */}
      <div
        style={{
          display: 'flex',
          gap: '40px',
          marginTop: '56px',
          paddingTop: '40px',
          borderTop: '1px solid var(--color-border)',
          flexWrap: 'wrap',
        }}
      >
        {[
          { value: '4,200+', label: 'Verified Clinicians' },
          { value: '380+', label: 'Partner Facilities' },
          { value: '98%', label: 'Fill Rate' },
          { value: '<2 hrs', label: 'Avg. Response Time' },
        ].map((stat) => (
          <div key={stat.label}>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.625rem',
                color: 'var(--color-ink)',
                lineHeight: 1,
                marginBottom: '4px',
              }}
            >
              {stat.value}
            </p>
            <p
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-ink-faint)',
              }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
