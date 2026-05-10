'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { LayoutDashboard, Calendar, PlusCircle, LogOut, User } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const NAV_ITEMS = user?.type === 'facility'
    ? [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/post-shift', label: 'Post Shift', icon: PlusCircle },
      ]
    : [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/shifts', label: 'Open Shifts', icon: Calendar },
      ];

  useEffect(() => {
    if (!loading && !user) router.replace('/auth/login');
  }, [user, loading, router]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-cream)' }}>
      <div style={{ width: '24px', height: '24px', border: '2px solid var(--color-border)', borderTopColor: 'var(--color-sage)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--color-cream)' }}>
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex" style={{ width: '220px', flexShrink: 0, background: 'var(--color-white)', borderRight: '1px solid var(--color-border)', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid var(--color-border)' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', color: 'var(--color-ink)' }}>
            Shift<em style={{ color: 'var(--color-sage)', fontStyle: 'italic' }}>Link</em>
          </Link>
          <div style={{ marginTop: '8px', fontSize: '0.6875rem', color: 'var(--color-ink-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            {user.type === 'facility' ? 'Facility' : 'Professional'}
          </div>
        </div>

        <nav style={{ flex: 1, padding: '12px 10px' }}>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: active ? 500 : 400, color: active ? 'var(--color-sage-dark)' : 'var(--color-ink-muted)', background: active ? 'var(--color-sage-light)' : 'transparent', marginBottom: '2px' }}>
                <Icon size={16}/> {label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '16px', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '32px', height: '32px', background: 'var(--color-sage-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <User size={14} style={{ color: 'var(--color-sage-dark)' }}/>
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</p>
              <p style={{ fontSize: '0.6875rem', color: 'var(--color-ink-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
            </div>
          </div>
          <button onClick={() => { logout(); router.push('/'); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--color-ink-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', width: '100%' }}>
            <LogOut size={14}/> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Mobile top bar */}
        <div className="md:hidden" style={{ background: 'var(--color-white)', borderBottom: '1px solid var(--color-border)', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 40 }}>
          <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', color: 'var(--color-ink)' }}>
            Shift<em style={{ color: 'var(--color-sage)', fontStyle: 'italic' }}>Link</em>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '28px', height: '28px', background: 'var(--color-sage-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={13} style={{ color: 'var(--color-sage-dark)' }}/>
            </div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-ink)' }}>{user.name.split(' ')[0]}</span>
          </div>
        </div>

        <div style={{ flex: 1, paddingBottom: '72px' }}>{children}</div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, background: 'var(--color-white)', borderTop: '1px solid var(--color-border)', display: 'flex', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '10px 8px', color: active ? 'var(--color-sage-dark)' : 'var(--color-ink-faint)' }}>
              <Icon size={20} strokeWidth={active ? 2 : 1.5}/>
              <span style={{ fontSize: '0.625rem', fontWeight: active ? 600 : 400, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</span>
            </Link>
          );
        })}
        <button onClick={() => { logout(); router.push('/'); }} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '10px 8px', color: 'var(--color-ink-faint)', background: 'none', border: 'none', cursor: 'pointer' }}>
          <LogOut size={20} strokeWidth={1.5}/>
          <span style={{ fontSize: '0.625rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Out</span>
        </button>
      </nav>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
