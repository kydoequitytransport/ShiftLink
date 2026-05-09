import { ShiftRole } from '@/lib/types';

export function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function formatShiftHours(start: string, end: string): string {
  return `${formatTime(start)} – ${formatTime(end)}`;
}

export function calculateShiftDuration(start: string, end: string): number {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let startMins = sh * 60 + sm;
  let endMins = eh * 60 + em;
  if (endMins < startMins) endMins += 24 * 60; // overnight
  return (endMins - startMins) / 60;
}

export function formatRate(ratePerHour: number): string {
  return `$${ratePerHour}/hr`;
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export const SHIFT_ROLES: ShiftRole[] = [
  'Registered Nurse',
  'Licensed Vocational Nurse',
  'Certified Nursing Assistant',
  'Medical-Surgical Nurse',
  'ICU Nurse',
  'Emergency Room Nurse',
  'Surgical Tech',
];
