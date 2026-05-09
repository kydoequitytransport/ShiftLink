'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useShifts } from '@/lib/hooks/useShifts';
import { ShiftCard } from '@/components/shifts/ShiftCard';
import { ShiftFilter } from '@/components/shifts/ShiftFilter';
import { MOCK_SHIFTS } from '@/lib/mock-data/shifts';

export default function ShiftBoardPage() {
  const { user } = useAuth();
  const { shifts, allShifts, filters, updateFilter, resetFilters, claimShift, isClaimedByUser } = useShifts(user?.id);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const handleClaim = (shiftId: string) => {
    claimShift(shiftId);
    setConfirmingId(shiftId);
    setTimeout(() => setConfirmingId(null), 3000);
  };

  return (
    <div style={{ padding: '40px 32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-sage)', marginBottom: '6px' }}>
          Shift Board
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.875rem',
            color: 'var(--color-ink)',
            lineHeight: 1.15,
          }}
        >
          Open Shifts
        </h1>
      </div>

      {/* Confirmation toast */}
      {confirmingId && (
        <div
          style={{
            position: 'fixed',
            top: 'var(--page-gutter)',
            right: 'var(--page-gutter)',
            zIndex: 100,
            background: 'var(--color-sage-dark)',
            color: 'white',
            padding: '14px 20px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            fontWeight: 500,
            boxShadow: 'var(--shadow-elevated)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'slideIn 0.25s ease',
          }}
        >
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M1.5 6l4.5 4.5 8.5-9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Shift claimed successfully!
        </div>
      )}

      {/* Filters */}
      <div style={{ marginBottom: '24px' }}>
        <ShiftFilter
          filters={filters}
          onUpdate={updateFilter}
          onReset={resetFilters}
          totalCount={allShifts.length}
          filteredCount={shifts.length}
        />
      </div>

      {/* Shift grid */}
      {shifts.length === 0 ? (
        <div
            style={{
            textAlign: 'center',
            padding: '64px var(--page-gutter)',
            background: 'var(--color-white)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
          }}
        >
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-ink)', marginBottom: '8px' }}>
            No shifts match your filters.
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-muted)', marginBottom: '20px' }}>
            Try adjusting your role or date filter.
          </p>
          <button
            onClick={resetFilters}
            style={{ fontSize: '0.8125rem', color: 'var(--color-sage)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {shifts.map((shift) => (
            <ShiftCard
              key={shift.id}
              shift={shift}
              isClaimed={isClaimedByUser(shift.id)}
              onClaim={handleClaim}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
