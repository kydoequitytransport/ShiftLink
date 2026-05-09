'use client';

import { useState, useMemo } from 'react';
import { Shift, FilterState, ShiftRole } from '@/lib/types';
import { MOCK_SHIFTS } from '@/lib/mock-data/shifts';

export function useShifts(userId?: string) {
  const [shifts, setShifts] = useState<Shift[]>(MOCK_SHIFTS);
  const [filters, setFilters] = useState<FilterState>({ role: 'All', date: '' });
  const [claimedIds, setClaimedIds] = useState<Set<string>>(new Set());

  const filteredShifts = useMemo(() => {
    return shifts.filter((shift) => {
      const roleMatch = filters.role === 'All' || shift.role === filters.role;
      const dateMatch = !filters.date || shift.date === filters.date;
      return roleMatch && dateMatch;
    });
  }, [shifts, filters]);

  const claimShift = (shiftId: string) => {
    if (!userId) return false;
    setShifts((prev) =>
      prev.map((s) =>
        s.id === shiftId ? { ...s, claimedBy: userId } : s
      )
    );
    setClaimedIds((prev) => new Set(prev).add(shiftId));
    return true;
  };

  const isClaimedByUser = (shiftId: string) => claimedIds.has(shiftId);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters({ role: 'All', date: '' });

  return {
    shifts: filteredShifts,
    allShifts: shifts,
    filters,
    updateFilter,
    resetFilters,
    claimShift,
    isClaimedByUser,
  };
}
