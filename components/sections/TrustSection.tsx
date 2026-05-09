const testimonials = [
  {
    quote:
      'I picked up 3 shifts in my first week. The credential process was fast and I got paid right on time.',
    name: 'Maria C.',
    role: 'Registered Nurse, ICU',
    location: 'Los Angeles, CA',
  },
  {
    quote:
      'We had a last-minute call-out at 10 PM. ShiftLink had a confirmed replacement by midnight.',
    name: 'James T.',
    role: 'Staffing Coordinator',
    location: 'Cedars-Sinai Hospital',
  },
  {
    quote:
      'Finally a platform that respects my time. I work when I want, and the rates are actually fair.',
    name: 'Priya S.',
    role: 'Certified Nursing Assistant',
    location: 'Orange County, CA',
  },
];

export function TrustSection() {
  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-ink-faint)',
                marginBottom: '8px',
              }}
            >
              In Their Words
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
                color: 'var(--color-ink)',
                lineHeight: 1.15,
              }}
            >
              Trusted by clinicians
              <br />
              <em style={{ color: 'var(--color-sage)', fontStyle: 'italic' }}>
                and the people who hire them.
              </em>
            </h2>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              style={{
                background: i === 1 ? 'var(--color-sage-light)' : 'var(--color-parchment)',
                borderRadius: 'var(--radius-md)',
                padding: '36px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              {/* Quote mark */}
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '3rem',
                  lineHeight: 1,
                  color: i === 1 ? 'var(--color-sage)' : 'var(--color-border)',
                  display: 'block',
                  marginBottom: '-12px',
                }}
              >
                "
              </span>
              <p
                style={{
                  fontSize: '0.9375rem',
                  lineHeight: 1.75,
                  color: 'var(--color-ink)',
                  fontWeight: 300,
                  fontStyle: 'italic',
                }}
              >
                {t.quote}
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-ink)', marginBottom: '2px' }}>
                  {t.name}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-ink-muted)' }}>{t.role}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-ink-faint)' }}>{t.location}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Logos strip */}
        <div
          style={{
            marginTop: '64px',
            paddingTop: '40px',
            borderTop: '1px solid var(--color-border)',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: '0.6875rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-faint)',
              marginBottom: '28px',
            }}
          >
            Trusted by leading healthcare facilities
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '40px',
              flexWrap: 'wrap',
            }}
          >
            {[
              'St. Mary Medical',
              'Cedars-Sinai',
              'Harbor UCLA',
              'Hoag Hospital',
              'Providence Holy Cross',
            ].map((name) => (
              <span
                key={name}
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  color: 'var(--color-ink-faint)',
                  textTransform: 'uppercase',
                }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
