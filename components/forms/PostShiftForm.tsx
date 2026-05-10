'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShiftRole } from '@/lib/types';
import { SHIFT_ROLES } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { getFacilityId, postShift } from '@/lib/supabase/shifts.service';

interface PostShiftFormProps {
  userId: string;
}

export function PostShiftForm({ userId }: PostShiftFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    role: '' as ShiftRole | '',
    shiftDate: '',
    startTime: '',
    endTime: '',
    ratePerHour: '',
    urgency: 'standard' as 'standard' | 'urgent',
    notes: '',
  });

  const set = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.role) e.role = 'Select a role';
    if (!form.shiftDate) e.shiftDate = 'Select a date';
    if (!form.startTime) e.startTime = 'Select start time';
    if (!form.endTime) e.endTime = 'Select end time';
    const rate = Number(form.ratePerHour);
    if (!rate || rate < 1) e.ratePerHour = 'Enter a valid rate';
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const facilityId = await getFacilityId(userId);
      if (!facilityId) throw new Error('Facility profile not found. Make sure you signed up as a Facility.');
      await postShift({
        facilityId,
        role: form.role as ShiftRole,
        shiftDate: form.shiftDate,
        startTime: form.startTime,
        endTime: form.endTime,
        ratePerHour: Number(form.ratePerHour),
        urgency: form.urgency,
        notes: form.notes,
      });
      setSuccess(true);
    } catch (e: any) {
      setErrors({ form: e?.message || 'Failed to post shift.' });
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div style={{ textAlign: 'center', padding: '32px 0' }}>
      <div style={{ width: '56px', height: '56px', background: 'var(--color-sage-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
        <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
          <path d="M2 9l7 7L22 2" stroke="var(--color-sage-dark)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-ink)', marginBottom: '10px' }}>Shift posted!</h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--color-ink-muted)', marginBottom: '28px' }}>It's now live on the shift board and visible to professionals.</p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button variant="primary" onClick={() => { setSuccess(false); setForm({ role:'' as ShiftRole|'', shiftDate:'', startTime:'', endTime:'', ratePerHour:'', urgency:'standard', notes:'' }); }}>
          Post Another
        </Button>
        <Button variant="outline" onClick={() => router.push('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {errors.form && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-sm)', padding: '12px 16px', fontSize: '0.875rem', color: '#B91C1C' }}>
          {errors.form}
        </div>
      )}

      <Select
        label="Role Needed"
        value={form.role}
        options={SHIFT_ROLES.map(r => ({ value: r, label: r }))}
        placeholder="Select clinical role"
        onChange={e => set('role', e.target.value)}
        error={errors.role}
      />

      <Input
        label="Shift Date"
        type="date"
        value={form.shiftDate}
        onChange={e => set('shiftDate', e.target.value)}
        error={errors.shiftDate}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Input label="Start Time" type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)} error={errors.startTime}/>
        <Input label="End Time" type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)} error={errors.endTime}/>
      </div>

      <Input
        label="Rate per Hour (₱ or $)"
        type="number"
        min="1"
        value={form.ratePerHour}
        onChange={e => set('ratePerHour', e.target.value)}
        placeholder="600"
        error={errors.ratePerHour}
        hint="Enter hourly rate in your local currency."
      />

      <Select
        label="Urgency"
        value={form.urgency}
        options={[
          { value: 'standard', label: 'Standard' },
          { value: 'urgent', label: 'Urgent — needed ASAP' },
        ]}
        onChange={e => set('urgency', e.target.value as 'standard' | 'urgent')}
      />

      <div>
        <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-ink-muted)', marginBottom: '6px' }}>
          Notes (optional)
        </label>
        <textarea
          value={form.notes}
          onChange={e => set('notes', e.target.value)}
          placeholder="Special requirements, parking info, floor details…"
          rows={3}
          style={{ width: '100%', padding: '12px 16px', background: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: 'var(--color-ink)', fontFamily: 'var(--font-body)', resize: 'vertical' }}
        />
      </div>

      <Button variant="primary" size="lg" fullWidth onClick={handleSubmit} loading={loading}>
        Post Shift
      </Button>
    </div>
  );
}
