import { supabase } from './client';
import { AuthUser, UserType } from '@/lib/types';

/** Read profile row from DB and shape into AuthUser */
export async function fetchProfile(userId: string, email: string): Promise<AuthUser | null> {
  // Race against a 6-second timeout — a hung Supabase query (e.g. invalid/expired JWT)
  // should never freeze the loading spinner indefinitely.
  const queryPromise = supabase
    .from('profiles')
    .select('full_name, user_type')
    .eq('id', userId)
    .single();

  const timeoutPromise = new Promise<{ data: null; error: Error }>(resolve =>
    setTimeout(() => resolve({ data: null, error: new Error('timeout') }), 6000)
  );

  const { data, error } = await Promise.race([queryPromise, timeoutPromise]);
  if (error || !data) return null;
  return { id: userId, name: data.full_name ?? '', email, type: data.user_type as UserType };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user!;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export interface SignUpProfessionalPayload {
  userType: 'professional';
  email: string;
  password: string;
  fullName: string;
  role: string;
  licenseNumber: string;
  yearsExperience: number;
}

export interface SignUpFacilityPayload {
  userType: 'facility';
  email: string;
  password: string;
  fullName: string; // contact person
  facilityName: string;
  facilityType: string;
  address: string;
}

export type SignUpPayload = SignUpProfessionalPayload | SignUpFacilityPayload;

export async function signUp(payload: SignUpPayload) {
  // 1. Create auth user — trigger will insert into profiles automatically
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        full_name: payload.fullName,
        user_type: payload.userType,
      },
    },
  });
  if (error) throw error;
  const user = data.user!;

  // 2. Insert role-specific record
  if (payload.userType === 'professional') {
    const { error: e } = await supabase.from('professionals').insert({
      profile_id: user.id,
      role: payload.role,
      license_number: payload.licenseNumber,
      years_experience: payload.yearsExperience,
    });
    if (e) throw e;
  } else {
    const { error: e } = await supabase.from('facilities').insert({
      profile_id: user.id,
      facility_name: payload.facilityName,
      facility_type: payload.facilityType,
      address: payload.address,
      contact_person: payload.fullName,
    });
    if (e) throw e;
  }

  return user;
}