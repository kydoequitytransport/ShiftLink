"use client";

import { FilterState } from '@/lib/types';
import { SHIFT_ROLES } from '@/lib/utils';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface ShiftFilterProps {
  filters: FilterState;
  onUpdate: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
}

const roleOptions = [
  { value: 'All', label: 'All Roles' },
  ...SHIFT_ROLES.map((r) => ({ value: r, label: r })),
];

export function ShiftFilter({ filters, onUpdate, onReset, totalCount, filteredCount }: ShiftFilterProps) {
  const hasActiveFilters = filters.role !== 'All' || !!filters.date;

  return (
    <div style={{ background: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Top row: filters */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 160px', minWidth: '140px' }}>
          <Select
            label="Role"
            value={filters.role}
            options={roleOptions}
            onChange={(e) => onUpdate('role', e.target.value)}
          />
        </div>
        <div style={{ flex: '1 1 140px', minWidth: '130px' }}>
          <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-ink-muted)', marginBottom: '6px' }}>
            Date
          </label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => onUpdate('date', e.target.value)}
            style={{ width: '100%', padding: '12px 16px', background: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', color: 'var(--color-ink)', fontFamily: 'var(--font-body)' }}
          />
        </div>
        {hasActiveFilters && (
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Button variant="ghost" size="sm" onClick={onReset}>Clear</Button>
          </div>
        )}
      </div>
      {/* Count */}
      <p style={{ fontSize: '0.8125rem', color: 'var(--color-ink-muted)' }}>
        Showing <strong style={{ color: 'var(--color-ink)' }}>{filteredCount}</strong> of{' '}
        <strong style={{ color: 'var(--color-ink)' }}>{totalCount}</strong> shifts
      </p>
    </div>
  );
}
