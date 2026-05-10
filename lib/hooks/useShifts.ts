'use client';

import { useState, useEffect, useMemo } from 'react';
import { Shift, FilterState } from '@/lib/types';
import {
  fetchOpenShifts,
  getProfessionalId,
  claimShift as claimShiftDB,
  ShiftRow,
} from '@/lib/supabase/shifts.service';

function rowToShift(r: ShiftRow): Shift {
  return {
    id: r.id,
    role: r.role,
    facilityName: r.facility_name ?? '',
    facilityLocation: r.facility_location ?? '',
    date: r.shift_date,
    startTime: (r.start_time ?? '').slice(0, 5),
    endTime: (r.end_time ?? '').slice(0, 5),
    ratePerHour: Number(r.rate_per_hour),
    urgency: r.urgency,
    claimedBy: r.claimed_by,
  };
}

export function useShifts(userId?: string) {
  const [allRows, setAllRows] = useState<ShiftRow[]>([]);
  const [filters, setFilters] = useState<FilterState>({ role: 'All', date: '' });
  const [claimedIds, setClaimedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchOpenShifts()
      .then(rows => { if (!cancelled) { setAllRows(rows); setLoading(false); } })
      .catch(e => { if (!cancelled) { setError('Could not load shifts.'); setLoading(false); console.error(e); } });
    return () => { cancelled = true; };
  }, []);

  const filteredShifts = useMemo(() => {
    return allRows
      .filter(r => {
        const roleMatch = filters.role === 'All' || r.role === filters.role;
        const dateMatch = !filters.date || r.shift_date === filters.date;
        return roleMatch && dateMatch;
      })
      .map(rowToShift);
  }, [allRows, filters]);

  const claimShift = async (shiftId: string): Promise<boolean> => {
    if (!userId) return false;
    try {
      const profId = await getProfessionalId(userId);
      if (!profId) throw new Error('No professional profile found.');
      await claimShiftDB(shiftId, profId);
      setClaimedIds(prev => new Set(prev).add(shiftId));
      // Update local row so UI reflects instantly
      setAllRows(prev =>
        prev.map(r => r.id === shiftId ? { ...r, status: 'claimed', claimed_by: profId } : r)
      );
      return true;
    } catch (e) {
      console.error('Claim error:', e);
      return false;
    }
  };

  const isClaimedByUser = (shiftId: string) => claimedIds.has(shiftId);

  const updateFilter = (key: keyof FilterState, value: string) =>
    setFilters(prev => ({ ...prev, [key]: value }));

  const resetFilters = () => setFilters({ role: 'All', date: '' });

  return {
    shifts: filteredShifts,
    allShifts: allRows.map(rowToShift),
    filters,
    loading,
    error,
    updateFilter,
    resetFilters,
    claimShift,
    isClaimedByUser,
  };
}
