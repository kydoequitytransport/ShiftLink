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
    <div
      style={{
        background: 'var(--color-white)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: '20px var(--page-gutter)',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '16px',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ flex: '1 1 200px', minWidth: '160px' }}>
        <Select
          label="Role"
          value={filters.role}
          options={roleOptions}
          onChange={(e) => onUpdate('role', e.target.value)}
        />
      </div>

      <div style={{ flex: '1 1 160px', minWidth: '140px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--color-ink-muted)',
            marginBottom: '6px',
          }}
        >
          Date
        </label>
        <input
          type="date"
          value={filters.date}
          onChange={(e) => onUpdate('date', e.target.value)}
          style={{
            width: '100%',
            paddingInline: `calc(16px + var(--input-extra-side, 8px))`,
            paddingBlock: `calc(12px + var(--input-extra-vertical, 4px))`,
            background: 'var(--color-white)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            color: 'var(--color-ink)',
            fontFamily: 'var(--font-body)',
          }}
        />
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          Clear
        </Button>
      )}

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-ink-muted)' }}>
          Showing <strong style={{ color: 'var(--color-ink)' }}>{filteredCount}</strong>
          {' '}of <strong style={{ color: 'var(--color-ink)' }}>{totalCount}</strong> shifts
        </p>
      </div>
    </div>
  );
}
