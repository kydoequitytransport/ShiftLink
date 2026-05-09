import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const professionalPoints = [
  'Browse verified shifts near you in real time',
  'Set your availability — work as much or as little as you choose',
  'Get paid within 72 hours of shift completion',
  'No membership fees, ever',
];

const facilityPoints = [
  'Post open shifts in under 3 minutes',
  'Access a pre-credentialed pool of local talent',
  'Rate clinicians and build your preferred roster',
  'Cancel or modify up to 4 hours before shift start',
];

export function ValuePropSection() {
  return (
    <section
      id="how-it-works"
      style={{
        background: 'var(--color-parchment)',
        padding: '80px var(--page-gutter)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section label */}
        <p
          style={{
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-ink-faint)',
            marginBottom: '16px',
            textAlign: 'center',
          }}
        >
          Two Sides. One Platform.
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            textAlign: 'center',
            color: 'var(--color-ink)',
            marginBottom: '64px',
            lineHeight: 1.15,
          }}
        >
          Built for the people who keep
          <br />
          <em style={{ color: 'var(--color-sage)', fontStyle: 'italic' }}>healthcare running.</em>
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2px',
            background: 'var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}
        >
          {/* Professionals card */}
          <div
            style={{
              background: 'var(--color-cream)',
              padding: '48px 40px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            <div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  background: 'var(--color-sage-light)',
                  color: 'var(--color-sage-dark)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '16px',
                }}
              >
                For Professionals
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.75rem',
                  lineHeight: 1.2,
                  color: 'var(--color-ink)',
                  marginBottom: '12px',
                }}
              >
                Your schedule,<br />your terms.
              </h3>
              <p
                style={{
                  fontSize: '0.9375rem',
                  color: 'var(--color-ink-muted)',
                  lineHeight: 1.7,
                }}
              >
                Pick up shifts that fit your life. RNs, LVNs, CNAs, and techs
                use ShiftLink to supplement income or build a full per diem career.
              </p>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {professionalPoints.map((point) => (
                <li
                  key={point}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    fontSize: '0.875rem',
                    color: 'var(--color-ink-muted)',
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      width: '16px',
                      height: '16px',
                      background: 'var(--color-sage)',
                      borderRadius: '50%',
                      flexShrink: 0,
                      marginTop: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {point}
                </li>
              ))}
            </ul>

            <div style={{ marginTop: '16px', width: '100%' }}>
              <div style={{ maxWidth: '420px' }}>
                <Link href="/signup?type=professional">
                  <Button variant="secondary" size="lg" fullWidth>Join as a Professional →</Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Facilities card */}
          <div
            id="for-facilities"
            style={{
              background: 'var(--color-ink)',
              padding: '48px 40px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            <div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '16px',
                }}
              >
                For Facilities
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.75rem',
                  lineHeight: 1.2,
                  color: 'var(--color-cream)',
                  marginBottom: '12px',
                }}
              >
                Fill gaps before
                <br />they become crises.
              </h3>
              <p
                style={{
                  fontSize: '0.9375rem',
                  color: 'rgba(246,243,238,0.65)',
                  lineHeight: 1.7,
                }}
              >
                Hospitals, clinics, and long-term care facilities post open
                shifts and get confirmed coverage — often within the hour.
              </p>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {facilityPoints.map((point) => (
                <li
                  key={point}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    fontSize: '0.875rem',
                    color: 'rgba(246,243,238,0.65)',
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      width: '16px',
                      height: '16px',
                      background: 'var(--color-sage)',
                      borderRadius: '50%',
                      flexShrink: 0,
                      marginTop: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {point}
                </li>
              ))}
            </ul>

            <div style={{ marginTop: '16px', width: '100%' }}>
              <div style={{ maxWidth: '420px' }}>
                <Link href="/signup?type=facility">
                  <Button
                    variant="ghost"
                    size="lg"
                    fullWidth
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      color: 'var(--color-cream)',
                      border: '1px solid rgba(255,255,255,0.14)',
                    }}
                  >
                    Post Your First Shift →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
