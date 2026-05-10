'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { useShifts } from '@/lib/hooks/useShifts';
import { Button } from '@/components/ui/Button';
import { Calendar, DollarSign, Clock, PlusCircle } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { allShifts, loading } = useShifts(user?.id);

  const urgentCount = allShifts.filter(s => s.urgency === 'urgent').length;
  const avgRate = allShifts.length
    ? Math.round(allShifts.reduce((s, sh) => s + sh.ratePerHour, 0) / allShifts.length)
    : 0;

  const isFacility = user?.type === 'facility';

  const stats = isFacility
    ? [
        { label: 'Total Shifts Posted', value: loading ? '—' : allShifts.length.toString(), icon: Calendar, color: 'var(--color-sage)' },
        { label: 'Urgent', value: loading ? '—' : urgentCount.toString(), icon: Clock, color: '#D4541A' },
        { label: 'Avg. Rate', value: loading ? '—' : `$${avgRate}/hr`, icon: DollarSign, color: 'var(--color-accent)' },
      ]
    : [
        { label: 'Open Shifts', value: loading ? '—' : allShifts.length.toString(), icon: Calendar, color: 'var(--color-sage)' },
        { label: 'Urgent Now', value: loading ? '—' : urgentCount.toString(), icon: Clock, color: '#D4541A' },
        { label: 'Avg. Rate', value: loading ? '—' : `$${avgRate}/hr`, icon: DollarSign, color: 'var(--color-accent)' },
      ];

  return (
    <div style={{ padding: 'clamp(24px, 5vw, 40px) clamp(16px, 4vw, 32px)', maxWidth: '900px' }}>
      <div style={{ marginBottom: '36px' }}>
        <p style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-sage)', marginBottom: '6px' }}>Dashboard</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 5vw, 2rem)', color: 'var(--color-ink)', lineHeight: 1.15, marginBottom: '8px' }}>
          Welcome back, {user?.name?.split(' ')[0] || 'there'}.
        </h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--color-ink-muted)', lineHeight: 1.7 }}>
          {isFacility
            ? `You have ${urgentCount} urgent shift${urgentCount !== 1 ? 's' : ''} posted.`
            : `There are ${urgentCount} urgent shift${urgentCount !== 1 ? 's' : ''} available near you.`}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '32px' }}>
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{ background: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '20px 16px', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ width: '32px', height: '32px', background: `${color}18`, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <Icon size={15} style={{ color }}/>
            </div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-ink)', lineHeight: 1, marginBottom: '4px' }}>{value}</p>
            <p style={{ fontSize: '0.6875rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-ink-faint)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* CTA card */}
      <div style={{ background: 'var(--color-ink)', borderRadius: 'var(--radius-md)', padding: 'clamp(24px, 4vw, 36px) clamp(20px, 4vw, 32px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem, 3vw, 1.375rem)', color: 'var(--color-cream)', marginBottom: '6px' }}>
            {isFacility ? 'Need coverage tonight?' : 'Ready to pick up a shift?'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'rgba(246,243,238,0.6)' }}>
            {isFacility ? 'Post a shift and get confirmed coverage fast.' : 'Browse all open shifts and claim one in seconds.'}
          </p>
        </div>
        <Link href={isFacility ? '/dashboard/post-shift' : '/dashboard/shifts'}>
          <Button variant="secondary" size="md">
            {isFacility ? 'Post a Shift' : 'Browse Shifts'} →
          </Button>
        </Link>
      </div>
    </div>
  );
}
