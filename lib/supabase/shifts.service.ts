import { supabase } from './client';
import { ShiftRole } from '@/lib/types';

export interface ShiftRow {
  id: string;
  role: ShiftRole;
  shift_date: string;
  start_time: string;
  end_time: string;
  rate_per_hour: number;
  urgency: 'standard' | 'urgent';
  status: 'open' | 'claimed' | 'completed' | 'cancelled';
  claimed_by: string | null;
  facility_name: string;
  facility_location: string;
}

/** Fetch open shifts from the view, with optional filters */
export async function fetchOpenShifts(filters?: {
  role?: string;
  date?: string;
}): Promise<ShiftRow[]> {
  let q = supabase
    .from('shifts_with_facility')
    .select('*')
    .eq('status', 'open')
    .order('shift_date', { ascending: true });

  if (filters?.role && filters.role !== 'All') {
    q = q.eq('role', filters.role);
  }
  if (filters?.date) {
    q = q.eq('shift_date', filters.date);
  }

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as ShiftRow[];
}

/** Get the professional row id for a given auth user id */
export async function getProfessionalId(profileId: string): Promise<string | null> {
  const { data } = await supabase
    .from('professionals')
    .select('id')
    .eq('profile_id', profileId)
    .single();
  return data?.id ?? null;
}

/** Get the facility row id for a given auth user id */
export async function getFacilityId(profileId: string): Promise<string | null> {
  const { data } = await supabase
    .from('facilities')
    .select('id')
    .eq('profile_id', profileId)
    .single();
  return data?.id ?? null;
}

/** Professional claims an open shift */
export async function claimShift(shiftId: string, professionalId: string): Promise<void> {
  const { error } = await supabase
    .from('shifts')
    .update({
      status: 'claimed',
      claimed_by: professionalId,
      claimed_at: new Date().toISOString(),
    })
    .eq('id', shiftId)
    .eq('status', 'open'); // only claim if still open
  if (error) throw error;
}

export interface PostShiftPayload {
  facilityId: string;
  role: ShiftRole;
  shiftDate: string;
  startTime: string;
  endTime: string;
  ratePerHour: number;
  urgency: 'standard' | 'urgent';
  notes?: string;
}

/** Facility posts a new shift */
export async function postShift(payload: PostShiftPayload): Promise<void> {
  const { error } = await supabase.from('shifts').insert({
    // DB Column Name : Payload Value
    facility_id:   payload.facilityId,   
    role:          payload.role,
    shift_date:    payload.shiftDate,    
    start_time:    payload.startTime,    
    end_time:      payload.endTime,      
    rate_per_hour: payload.ratePerHour,
    urgency:       payload.urgency,
    notes:         payload.notes ?? null,
    status:        'open',
  });

  if (error) {
    console.error('Insert Error Detail:', error);
    throw error;
  }
}

/** Fetch shifts posted by a specific facility */
export async function fetchFacilityShifts(facilityId: string): Promise<ShiftRow[]> {
  const { data, error } = await supabase
    .from('shifts_with_facility')
    .select('*')
    .eq('facility_id', facilityId)
    .order('shift_date', { ascending: true });
  if (error) throw error;
  return (data ?? []) as ShiftRow[];
}
