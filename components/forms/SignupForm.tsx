'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { UserType, ShiftRole } from '@/lib/types';
import { SHIFT_ROLES } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';

type Step = 'type' | 'details' | 'success';

const FACILITY_TYPES = [
  'Hospital', 'Long-Term Care', 'Outpatient Clinic',
  'Ambulatory Surgery Center', 'Home Health Agency',
  'Skilled Nursing Facility', 'Urgent Care', 'Other',
];

export function SignupForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { signup } = useAuth();

  const initialType = searchParams.get('type') as UserType | null;
  const [userType, setUserType] = useState<UserType | null>(initialType);
  const [step, setStep] = useState<Step>(initialType ? 'details' : 'type');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [proForm, setProForm] = useState({
    name: '', email: '', password: '',
    role: '' as ShiftRole | '',
    licenseNumber: '', yearsExp: '',
  });

  const [facForm, setFacForm] = useState({
    facilityName: '', contactName: '', email: '',
    password: '', facilityType: '', address: '',
  });

  const validatePro = () => {
    const e: Record<string, string> = {};
    if (!proForm.name.trim()) e.name = 'Name is required';
    if (!proForm.email.includes('@')) e.email = 'Valid email required';
    if (proForm.password.length < 8) e.password = 'At least 8 characters';
    if (!proForm.role) e.role = 'Select your role';
    if (!proForm.licenseNumber.trim()) e.licenseNumber = 'License number required';
    return e;
  };

  const validateFac = () => {
    const e: Record<string, string> = {};
    if (!facForm.facilityName.trim()) e.facilityName = 'Facility name required';
    if (!facForm.contactName.trim()) e.contactName = 'Contact name required';
    if (!facForm.email.includes('@')) e.email = 'Valid email required';
    if (facForm.password.length < 8) e.password = 'At least 8 characters';
    if (!facForm.facilityType) e.facilityType = 'Select facility type';
    return e;
  };

  const handleSubmit = async () => {
    const errs = userType === 'professional' ? validatePro() : validateFac();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      console.log('[SIGNUP] Submitting as', userType);
      if (userType === 'professional') {
        const authUser = await signup({
          email: proForm.email,
          password: proForm.password,
          name: proForm.name,
          type: 'professional',
        });
        // Insert into professionals with snake_case columns matching our SQL migration
        const { error: insErr } = await supabase.from('professionals').insert({
          profile_id: authUser.id,          // FK → profiles.id
          name: proForm.name,
          email: proForm.email,
          role: proForm.role,
          license_number: proForm.licenseNumber,
          years_of_experience: Number(proForm.yearsExp) || 0,
        });
        if (insErr) throw insErr;
        console.log('[SIGNUP] Professional inserted');
      } else {
        const authUser = await signup({
          email: facForm.email,
          password: facForm.password,
          name: facForm.contactName,
          type: 'facility',
        });
        // Insert into facilities with snake_case columns
        const { error: insErr } = await supabase.from('facilities').insert({
          profile_id: authUser.id,           // FK → profiles.id
          facility_name: facForm.facilityName,
          facility_type: facForm.facilityType,
          address: facForm.address,
          contact_person: facForm.contactName,
        });
        if (insErr) throw insErr;
        console.log('[SIGNUP] Facility inserted');
      }
      console.log('[SIGNUP] Success!');
      setStep('success');
    } catch (e: any) {
      console.error('[SIGNUP ERROR]', e);
      setErrors({ form: e.message || 'Signup failed. Please try again.' });
    } finally {
      console.log('[SIGNUP] Done, loading should be false');
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{ width: '56px', height: '56px', background: 'var(--color-sage-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
            <path d="M2 9l7 7L22 2" stroke="var(--color-sage-dark)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--color-ink)', marginBottom: '12px' }}>
          You're on the list.
        </h2>
        <p style={{ fontSize: '0.9375rem', color: 'var(--color-ink-muted)', marginBottom: '32px', lineHeight: 1.7 }}>
          {userType === 'professional'
            ? "We'll review your credentials and have you shift-ready within 24 hours. Check your inbox for next steps."
            : "Your facility account is being reviewed. Expect a confirmation email within a few hours."}
        </p>
        <Link href={userType === 'professional' ? '/dashboard' : '/'}>
          <Button variant="primary">
            {userType === 'professional' ? 'Browse Shifts' : 'Return Home'}
          </Button>
        </Link>
      </div>
    );
  }

  if (step === 'type') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-ink-muted)', marginBottom: '8px', textAlign: 'center' }}>
          I am joining as a…
        </p>
        {[
          {
            type: 'professional' as UserType,
            title: 'Healthcare Professional',
            desc: 'RN, LVN, CNA, Surgical Tech, and more — browse and claim open shifts.',
            hoverBorder: 'var(--color-sage)', hoverBg: 'var(--color-sage-light)',
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-sage-dark)" strokeWidth="1.75" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
            iconBg: 'var(--color-sage-light)',
          },
          {
            type: 'facility' as UserType,
            title: 'Healthcare Facility',
            desc: 'Hospital, clinic, or long-term care — post shifts and find coverage fast.',
            hoverBorder: 'var(--color-ink)', hoverBg: 'var(--color-parchment)',
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-muted)" strokeWidth="1.75" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
            iconBg: 'var(--color-parchment)',
          },
        ].map(({ type, title, desc, hoverBorder, hoverBg, icon, iconBg }) => (
          <button
            key={type}
            onClick={() => { setUserType(type); setStep('details'); }}
            style={{ background: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '24px', cursor: 'pointer', textAlign: 'left', display: 'flex', gap: '16px', alignItems: 'flex-start', width: '100%' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = hoverBorder; (e.currentTarget as HTMLElement).style.background = hoverBg; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'; (e.currentTarget as HTMLElement).style.background = 'var(--color-white)'; }}
          >
            <div style={{ width: '40px', height: '40px', background: iconBg, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {icon}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '4px' }}>{title}</p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-ink-muted)', lineHeight: 1.6 }}>{desc}</p>
            </div>
            <svg style={{ flexShrink: 0, color: 'var(--color-ink-faint)', marginTop: '4px' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
        <button onClick={() => setStep('type')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-ink-muted)', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
          ← Back
        </button>
        <span style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-sage)', background: 'var(--color-sage-light)', padding: '3px 8px', borderRadius: 'var(--radius-sm)' }}>
          {userType === 'professional' ? 'Professional' : 'Facility'}
        </span>
      </div>

      {errors.form && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-sm)', padding: '12px 16px', fontSize: '0.875rem', color: '#B91C1C' }}>
          {errors.form}
        </div>
      )}

      {userType === 'professional' ? (
        <>
          <Input label="Full Name" value={proForm.name} onChange={(e) => setProForm(p => ({ ...p, name: e.target.value }))} placeholder="Your full name" error={errors.name} />
          <Input label="Email" type="email" value={proForm.email} onChange={(e) => setProForm(p => ({ ...p, email: e.target.value }))} placeholder="you@email.com" error={errors.email} />
          <Input label="Password" type="password" value={proForm.password} onChange={(e) => setProForm(p => ({ ...p, password: e.target.value }))} placeholder="8+ characters" error={errors.password} />
          <Select label="Your Role" value={proForm.role} options={SHIFT_ROLES.map(r => ({ value: r, label: r }))} placeholder="Select your clinical role" onChange={(e) => setProForm(p => ({ ...p, role: e.target.value as ShiftRole }))} error={errors.role} />
          <Input label="License Number" value={proForm.licenseNumber} onChange={(e) => setProForm(p => ({ ...p, licenseNumber: e.target.value }))} placeholder="e.g. RN123456" error={errors.licenseNumber} hint="Used for credential verification only." />
          <Input label="Years of Experience" type="number" min="0" max="50" value={proForm.yearsExp} onChange={(e) => setProForm(p => ({ ...p, yearsExp: e.target.value }))} placeholder="3" />
        </>
      ) : (
        <>
          <Input label="Facility Name" value={facForm.facilityName} onChange={(e) => setFacForm(p => ({ ...p, facilityName: e.target.value }))} placeholder="St. Mary Medical Center" error={errors.facilityName} />
          <Input label="Contact Person" value={facForm.contactName} onChange={(e) => setFacForm(p => ({ ...p, contactName: e.target.value }))} placeholder="Your name" error={errors.contactName} />
          <Input label="Work Email" type="email" value={facForm.email} onChange={(e) => setFacForm(p => ({ ...p, email: e.target.value }))} placeholder="staffing@facility.org" error={errors.email} />
          <Input label="Password" type="password" value={facForm.password} onChange={(e) => setFacForm(p => ({ ...p, password: e.target.value }))} placeholder="8+ characters" error={errors.password} />
          <Select label="Facility Type" value={facForm.facilityType} options={FACILITY_TYPES.map(t => ({ value: t, label: t }))} placeholder="Select facility type" onChange={(e) => setFacForm(p => ({ ...p, facilityType: e.target.value }))} error={errors.facilityType} />
          <Input label="Address" value={facForm.address} onChange={(e) => setFacForm(p => ({ ...p, address: e.target.value }))} placeholder="123 Hospital Blvd, Los Angeles, CA" />
        </>
      )}

      <Button variant="primary" size="lg" fullWidth onClick={handleSubmit} loading={loading} style={{ marginTop: '8px' }}>
        Create Account
      </Button>

      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-ink-faint)', lineHeight: 1.7 }}>
        By creating an account you agree to our{' '}
        <Link href="/" style={{ textDecoration: 'underline' }}>Terms of Service</Link> and{' '}
        <Link href="/" style={{ textDecoration: 'underline' }}>Privacy Policy</Link>.
      </p>
    </div>
  );
}
