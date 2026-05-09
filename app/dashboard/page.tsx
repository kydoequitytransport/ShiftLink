'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { MOCK_SHIFTS } from '@/lib/mock-data/shifts';
import { Button } from '@/components/ui/Button';
import { Calendar, DollarSign, Clock, TrendingUp } from 'lucide-react';

const stats = [
  { label: 'Open Shifts', value: MOCK_SHIFTS.length.toString(), icon: Calendar, color: 'var(--color-sage)' },
  { label: 'Avg. Rate', value: '$58/hr', icon: DollarSign, color: 'var(--color-accent)' },
  { label: 'Urgent Now', value: MOCK_SHIFTS.filter(s => s.urgency === 'urgent').length.toString(), icon: Clock, color: '#D4541A' },
  { label: 'Est. Weekly', value: '$2,400', icon: TrendingUp, color: 'var(--color-sage-dark)' },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div style={{ padding: '40px 32px', maxWidth: '900px' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-sage)', marginBottom: '6px' }}>
          Dashboard
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            color: 'var(--color-ink)',
            lineHeight: 1.15,
            marginBottom: '8px',
          }}
        >
          Good morning, {user?.name?.split(' ')[0]}.
        </h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--color-ink-muted)', lineHeight: 1.7 }}>
          There are <strong>{MOCK_SHIFTS.filter(s => s.urgency === 'urgent').length} urgent shifts</strong> available near you right now.
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '16px',
          marginBottom: '40px',
        }}
      >
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            style={{
              background: 'var(--color-white)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '24px var(--page-gutter)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ width: '32px', height: '32px', background: `${color}18`, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={15} style={{ color }} />
              </div>
            </div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.625rem', color: 'var(--color-ink)', lineHeight: 1, marginBottom: '4px' }}>
              {value}
            </p>
            <p style={{ fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-ink-faint)' }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div
        style={{
          background: 'var(--color-ink)',
          borderRadius: 'var(--radius-md)',
          padding: '36px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', color: 'var(--color-cream)', marginBottom: '6px' }}>
            Ready to pick up a shift?
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'rgba(246,243,238,0.6)' }}>
            Browse all open shifts and claim one in seconds.
          </p>
        </div>
        <Link href="/dashboard/shifts">
          <Button variant="secondary" size="md">Browse Open Shifts →</Button>
        </Link>
      </div>
    </div>
  );
}
