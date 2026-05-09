import Link from 'next/link';

export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-parchment)',
        padding: '48px var(--page-gutter) 32px',
        marginTop: 'auto',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '32px', marginBottom: '48px' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-ink)' }}>
              Shift<em style={{ color: 'var(--color-sage)', fontStyle: 'italic' }}>Link</em>
            </span>
            <p style={{ marginTop: '12px', fontSize: '0.8125rem', color: 'var(--color-ink-muted)', lineHeight: 1.7 }}>
              Connecting healthcare professionals with the shifts that need them.
            </p>
          </div>
          <div>
            <p style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-ink-faint)', marginBottom: '12px' }}>
              Professionals
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Browse Shifts', 'How It Works', 'Sign Up'].map((item) => (
                <li key={item}>
                  <Link href="/signup" style={{ fontSize: '0.875rem', color: 'var(--color-ink-muted)' }}
                    className="hover:text-[var(--color-ink)]">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-ink-faint)', marginBottom: '12px' }}>
              Facilities
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Post a Shift', 'Pricing', 'Sign Up'].map((item) => (
                <li key={item}>
                  <Link href="/signup" style={{ fontSize: '0.875rem', color: 'var(--color-ink-muted)' }}
                    className="hover:text-[var(--color-ink)]">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-ink-faint)', marginBottom: '12px' }}>
              Company
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['About', 'Blog', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href="/" style={{ fontSize: '0.875rem', color: 'var(--color-ink-muted)' }}
                    className="hover:text-[var(--color-ink)]">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ paddingTop: '24px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-ink-faint)' }}>
            © 2026 ShiftLink Inc. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Privacy', 'Terms', 'HIPAA'].map((item) => (
              <Link key={item} href="/" style={{ fontSize: '0.75rem', color: 'var(--color-ink-faint)' }}
                className="hover:text-[var(--color-ink-muted)]">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
