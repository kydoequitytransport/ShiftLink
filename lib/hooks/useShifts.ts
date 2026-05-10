'use client';

import { useState, useEffect, useMemo } from 'react';
import { Shift, FilterState } from '@/lib/types';
import { supabase } from '@/lib/supabaseClient';

export function useShifts(userId?: string) {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [filters, setFilters] = useState<FilterState>({ role: 'All', date: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShifts = async () => {
      setLoading(true);
      setError(null);
      // Query the view we created — already joins facility data
      const { data, err } = await supabase
        .from('shifts_with_facility')
        .select('*')
        .eq('status', 'open')
        .order('shift_date', { ascending: true }) as any;

      if (err) {
        setError('Could not load shifts.');
      } else if (data) {
        setShifts(
          data.map((s: any): Shift => ({
            id: s.id,
            role: s.role,
            facilityName: s.facility_name ?? '',
            facilityLocation: s.facility_location ?? '',
            date: s.shift_date,
            startTime: (s.start_time ?? '').slice(0, 5),   // "07:00:00" → "07:00"
            endTime: (s.end_time ?? '').slice(0, 5),
            ratePerHour: Number(s.rate_per_hour),
            urgency: s.urgency ?? 'standard',
            claimedBy: s.claimed_by ?? null,
          }))
        );
      }
      setLoading(false);
    };
    fetchShifts();
  }, []);

  const filteredShifts = useMemo(() => {
    return shifts.filter((shift) => {
      const roleMatch = filters.role === 'All' || shift.role === filters.role;
      const dateMatch = !filters.date || shift.date === filters.date;
      return roleMatch && dateMatch;
    });
  }, [shifts, filters]);

  const claimShift = async (shiftId: string) => {
    if (!userId) return false;
    // Look up the professional row for this auth user
    const { data: prof } = await supabase
      .from('professionals')
      .select('id')
      .eq('profile_id', userId)
      .single();

    if (!prof) {
      console.error('No professional profile found for user', userId);
      return false;
    }

    const { error: claimErr } = await supabase
      .from('shifts')
      .update({ status: 'claimed', claimed_by: prof.id, claimed_at: new Date().toISOString() })
      .eq('id', shiftId)
      .eq('status', 'open'); // safe guard

    if (claimErr) {
      console.error('Claim error:', claimErr);
      return false;
    }

    setShifts((prev) =>
      prev.map((s) => s.id === shiftId ? { ...s, claimedBy: prof.id } : s)
    );
    return true;
  };

  const isClaimedByUser = (shiftId: string) => {
    const shift = shifts.find((s) => s.id === shiftId);
    return !!shift?.claimedBy;   // any claimed shift is shown as claimed for simplicity
  };

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters({ role: 'All', date: '' });

  return {
    shifts: filteredShifts,
    allShifts: shifts,
    filters,
    loading,
    error,
    updateFilter,
    resetFilters,
    claimShift,
    isClaimedByUser,
  };
}
