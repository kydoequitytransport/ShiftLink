export type UserType = 'professional' | 'facility';

export interface Shift {
  id: string;
  role: ShiftRole;
  facilityName: string;
  facilityLocation: string;
  date: string; // ISO date string
  startTime: string;
  endTime: string;
  ratePerHour: number;
  urgency: 'standard' | 'urgent';
  claimedBy?: string | null;
}

export type ShiftRole =
  | 'Registered Nurse'
  | 'Licensed Vocational Nurse'
  | 'Certified Nursing Assistant'
  | 'Medical-Surgical Nurse'
  | 'ICU Nurse'
  | 'Emergency Room Nurse'
  | 'Surgical Tech';

export interface Professional {
  id: string;
  name: string;
  email: string;
  role: ShiftRole;
  licenseNumber: string;
  yearsOfExperience: number;
}

export interface Facility {
  id: string;
  name: string;
  email: string;
  facilityType: string;
  address: string;
  contactPerson: string;
}

export interface FilterState {
  role: ShiftRole | 'All';
  date: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  type: UserType;
}
