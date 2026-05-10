'use client';


import { useState, useMemo } from 'react';
import { Shift, FilterState } from '@/lib/types';
// No more Supabase! In-memory mock shifts only

export function useShifts(userId?: string) {
  // Mock data: static shifts array
  const initialShifts: Shift[] = [
    {
      id: '1',
      role: 'Registered Nurse',
      facilityName: 'St. Luke Hospital',
      facilityLocation: 'Quezon City',
      date: '2026-05-12',
      startTime: '07:00',
      endTime: '15:00',
      ratePerHour: 600,
      urgency: 'standard',
      claimedBy: null,
    },
    {
      id: '2',
      role: 'Registered Nurse',
      facilityName: 'Makati Med',
      facilityLocation: 'Makati',
      date: '2026-05-13',
      startTime: '15:00',
      endTime: '23:00',
      ratePerHour: 650,
      urgency: 'urgent',
      claimedBy: null,
    },
    {
      id: '3',
      role: 'Registered Nurse',
      facilityName: 'Asian Hospital',
      facilityLocation: 'Alabang',
      date: '2026-05-14',
      startTime: '07:00',
      endTime: '19:00',
      ratePerHour: 400,
      urgency: 'standard',
      claimedBy: null,
    },
  ];

  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const [filters, setFilters] = useState<FilterState>({ role: 'All', date: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredShifts = useMemo(() => {
    return shifts.filter((shift) => {
      const roleMatch = filters.role === 'All' || shift.role === filters.role;
      const dateMatch = !filters.date || shift.date === filters.date;
      return roleMatch && dateMatch;
    });
  }, [shifts, filters]);

  const claimShift = async (shiftId: string) => {
    if (!userId) return false;
    setShifts((prev) =>
      prev.map((s) =>
        s.id === shiftId && !s.claimedBy
          ? { ...s, claimedBy: userId }
          : s
      )
    );
    return true;
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
    loading,
    error,
    updateFilter,
    resetFilters,
    claimShift,
    isClaimedByUser,
  };
}
