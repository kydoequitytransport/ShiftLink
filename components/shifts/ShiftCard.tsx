'use client';

import { Shift } from '@/lib/types';
import { formatDate, formatShiftHours, formatRate, calculateShiftDuration } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MapPin, Clock, DollarSign } from 'lucide-react';

interface ShiftCardProps {
  shift: Shift;
  isClaimed: boolean;
  onClaim: (shiftId: string) => void;
}

export function ShiftCard({ shift, isClaimed, onClaim }: ShiftCardProps) {
  const duration = calculateShiftDuration(shift.startTime, shift.endTime);
  const totalEarnings = duration * shift.ratePerHour;

  return (
    <article
      style={{
        background: 'var(--color-white)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        boxShadow: 'var(--shadow-card)',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
        ...(isClaimed ? { borderColor: 'var(--color-sage)', background: 'var(--color-sage-light)' } : {}),
      }}
      onMouseEnter={(e) => {
        if (!isClaimed) {
          (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-elevated)';
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-ink-faint)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isClaimed) {
          (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card)';
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
        }
      }}
    >
      {/* Top row: role + urgency badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1875rem',
              color: 'var(--color-ink)',
              marginBottom: '4px',
              lineHeight: 1.2,
            }}
          >
            {shift.role}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-ink-muted)' }}>
            <MapPin size={12} />
            <span style={{ fontSize: '0.8125rem' }}>{shift.facilityName}</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-ink-faint)' }}>·</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-ink-faint)' }}>{shift.facilityLocation}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          {shift.urgency === 'urgent' && <Badge variant="urgent">Urgent</Badge>}
          {isClaimed && <Badge variant="sage">Claimed ✓</Badge>}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--color-border)' }} />

      {/* Shift details grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
        }}
      >
        <div>
          <p style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-ink-faint)', marginBottom: '4px' }}>
            Date
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-ink)', fontWeight: 500 }}>
            {formatDate(shift.date)}
          </p>
        </div>
        <div>
          <p style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-ink-faint)', marginBottom: '4px' }}>
            Hours
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={11} style={{ color: 'var(--color-ink-faint)' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--color-ink)', fontWeight: 500 }}>
              {formatShiftHours(shift.startTime, shift.endTime)}
            </p>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-ink-faint)', marginTop: '2px' }}>
            {duration}h shift
          </p>
        </div>
        <div>
          <p style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-ink-faint)', marginBottom: '4px' }}>
            Pay
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <DollarSign size={11} style={{ color: 'var(--color-ink-faint)' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--color-ink)', fontWeight: 500 }}>
              {formatRate(shift.ratePerHour)}
            </p>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-sage-dark)', fontWeight: 500, marginTop: '2px' }}>
            ~${totalEarnings.toFixed(0)} est.
          </p>
        </div>
      </div>

      {/* Claim button */}
      {!isClaimed ? (
        <Button
          variant="primary"
          size="sm"
          fullWidth
          onClick={() => onClaim(shift.id)}
          style={{ marginTop: '4px' }}
        >
          Claim Shift
        </Button>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '10px',
            background: 'var(--color-sage)',
            borderRadius: 'var(--radius-sm)',
            marginTop: '4px',
          }}
        >
          <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'white' }}>
            ✓ Shift Confirmed
          </p>
        </div>
      )}
    </article>
  );
}
