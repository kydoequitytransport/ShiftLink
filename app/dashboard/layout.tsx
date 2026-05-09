'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { LayoutDashboard, Calendar, LogOut, User } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/shifts', label: 'Open Shifts', icon: Calendar },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '24px', height: '24px', border: '2px solid var(--color-border)', borderTopColor: 'var(--color-sage)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--color-cream)' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '240px',
          flexShrink: 0,
          background: 'var(--color-white)',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          padding: '0',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
        className="hidden md:flex"
      >
        {/* Logo */}
        <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid var(--color-border)' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.1875rem', color: 'var(--color-ink)' }}>
            Shift<em style={{ color: 'var(--color-sage)', fontStyle: 'italic' }}>Link</em>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: active ? 500 : 400,
                  color: active ? 'var(--color-sage-dark)' : 'var(--color-ink-muted)',
                  background: active ? 'var(--color-sage-light)' : 'transparent',
                  marginBottom: '2px',
                }}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '32px', height: '32px', background: 'var(--color-sage-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <User size={14} style={{ color: 'var(--color-sage-dark)' }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name}
              </p>
              <p style={{ fontSize: '0.6875rem', color: 'var(--color-ink-faint)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => { logout(); router.push('/'); }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--color-ink-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', width: '100%' }}
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, minWidth: 0 }}>
        {/* Mobile top bar */}
        <div
          className="md:hidden"
          style={{
            background: 'var(--color-white)',
            borderBottom: '1px solid var(--color-border)',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', color: 'var(--color-ink)' }}>
            Shift<em style={{ color: 'var(--color-sage)', fontStyle: 'italic' }}>Link</em>
          </Link>
          <div style={{ display: 'flex', gap: '16px' }}>
            {NAV_ITEMS.map(({ href, label }) => (
              <Link key={href} href={href} style={{ fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: pathname === href ? 'var(--color-sage)' : 'var(--color-ink-muted)', fontWeight: pathname === href ? 600 : 400 }}>
                {label}
              </Link>
            ))}
          </div>
        </div>
        {children}
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
