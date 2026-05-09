'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(246, 243, 238, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', color: 'var(--color-ink)', letterSpacing: '-0.01em' }}>
            Shift<em style={{ color: 'var(--color-sage)', fontStyle: 'italic' }}>Link</em>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="hidden md:flex">
          <Link
            href="/#how-it-works"
            style={{ fontSize: '0.8125rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-ink-muted)', fontWeight: 500 }}
            className="hover:text-[var(--color-ink)]"
          >
            How It Works
          </Link>
          <Link
            href="/#for-facilities"
            style={{ fontSize: '0.8125rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-ink-muted)', fontWeight: 500 }}
            className="hover:text-[var(--color-ink)]"
          >
            Facilities
          </Link>
          <Link href="/auth/login">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="sm">Get Started</Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ color: 'var(--color-ink)', background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            background: 'var(--color-cream)',
            borderTop: '1px solid var(--color-border)',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <Link href="/#how-it-works" onClick={() => setMenuOpen(false)}
            style={{ fontSize: '0.8125rem', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>
            How It Works
          </Link>
          <Link href="/#for-facilities" onClick={() => setMenuOpen(false)}
            style={{ fontSize: '0.8125rem', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>
            Facilities
          </Link>
          <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
            <Button variant="outline" size="sm" fullWidth>Sign in</Button>
          </Link>
          <Link href="/signup" onClick={() => setMenuOpen(false)}>
            <Button variant="primary" size="sm" fullWidth>Get Started</Button>
          </Link>
        </div>
      )}
    </header>
  );
}
