'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useShifts } from '@/lib/hooks/useShifts';
import { ShiftCard } from '@/components/shifts/ShiftCard';
import { ShiftFilter } from '@/components/shifts/ShiftFilter';

export default function ShiftBoardPage() {
  const { user } = useAuth();
  const { shifts, allShifts, filters, loading, error, updateFilter, resetFilters, claimShift, isClaimedByUser } = useShifts(user?.id);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const handleClaim = async (shiftId: string) => {
    const ok = await claimShift(shiftId);
    if (ok) {
      setConfirmingId(shiftId);
      setTimeout(() => setConfirmingId(null), 3000);
    }
  };

  return (
    <div style={{ padding: 'clamp(24px, 5vw, 40px) clamp(16px, 4vw, 32px)' }}>
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-sage)', marginBottom: '6px' }}>
          Shift Board
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 5vw, 1.875rem)', color: 'var(--color-ink)', lineHeight: 1.15 }}>
          Open Shifts
        </h1>
      </div>

      {confirmingId && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', left: '20px', zIndex: 100, background: 'var(--color-sage-dark)', color: 'white', padding: '14px 20px', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 500, boxShadow: 'var(--shadow-elevated)', display: 'flex', alignItems: 'center', gap: '10px', animation: 'slideIn 0.25s ease', maxWidth: '400px', marginInline: 'auto' }}>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M1.5 6l4.5 4.5 8.5-9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Shift claimed successfully!
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <ShiftFilter filters={filters} onUpdate={updateFilter} onReset={resetFilters} totalCount={allShifts.length} filteredCount={shifts.length} />
      </div>

      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-md)', padding: '16px 20px', marginBottom: '20px', fontSize: '0.875rem', color: '#B91C1C' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ background: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', height: '210px', opacity: 0.5, animation: 'pulse 1.4s ease-in-out infinite', animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      ) : shifts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '56px 24px', background: 'var(--color-white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-ink)', marginBottom: '8px' }}>No shifts match your filters.</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-muted)', marginBottom: '20px' }}>Try adjusting your role or date.</p>
          <button onClick={resetFilters} style={{ fontSize: '0.8125rem', color: 'var(--color-sage)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>
            Clear all filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {shifts.map((shift) => (
            <ShiftCard key={shift.id} shift={shift} isClaimed={isClaimedByUser(shift.id)} onClaim={handleClaim} />
          ))}
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.2; } }
      `}</style>
    </div>
  );
}
