'use client';

import { useState, useEffect, useMemo } from 'react';
import { Shift, FilterState, ShiftRole } from '@/lib/types';
import { supabase } from '@/lib/supabaseClient';

export function useShifts(userId?: string) {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [filters, setFilters] = useState<FilterState>({ role: 'All', date: '' });
  const [loading, setLoading] = useState(false);

  // Fetch shifts from Supabase
  useEffect(() => {
    const fetchShifts = async () => {
      setLoading(true);
      let query = supabase.from('shifts').select(`*, facilities(name: name, facilityLocation: location)`);
      const { data, error } = await query;
      if (!error && data) {
        setShifts(data.map((s: any) => ({
          id: s.id,
          role: s.role,
          facilityName: s.facility_name || s.facilities?.name || '',
          facilityLocation: s.facility_location || s.facilities?.facilityLocation || '',
          date: s.date,
          startTime: s.time?.split('-')[0] || s.startTime || '',
          endTime: s.time?.split('-')[1] || s.endTime || '',
          ratePerHour: s.rate || s.ratePerHour,
          urgency: s.urgency || 'standard',
          claimedBy: s.claimed_by || s.claimedBy || null,
        })));
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

  // Claim a shift (update claimed_by field)
  const claimShift = async (shiftId: string) => {
    if (!userId) return false;
    const { error } = await supabase
      .from('shifts')
      .update({ claimed_by: userId })
      .eq('id', shiftId);
    if (!error) {
      setShifts((prev) =>
        prev.map((s) =>
          s.id === shiftId ? { ...s, claimedBy: userId } : s
        )
      );
      return true;
    }
    return false;
  };

  const isClaimedByUser = (shiftId: string) => {
    const shift = shifts.find((s) => s.id === shiftId);
    return shift?.claimedBy === userId;
  };

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
    loading,
  };
}
