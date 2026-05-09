'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'accent';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  as?: 'button' | 'a';
  href?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--color-ink)] text-[var(--color-cream)] hover:bg-[var(--color-sage-dark)] active:scale-[0.98]',
  secondary: 'bg-[var(--color-sage)] text-white hover:bg-[var(--color-sage-dark)] active:scale-[0.98]',
  ghost: 'bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-parchment)] active:scale-[0.98]',
  outline: 'bg-transparent border border-[var(--color-border)] text-[var(--color-ink)] hover:border-[var(--color-sage)] hover:text-[var(--color-sage)] active:scale-[0.98]',
  accent: 'bg-[var(--color-accent)] text-white hover:opacity-90 active:scale-[0.98]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-xs px-4 py-2 tracking-wide',
  md: 'text-sm px-6 py-3 tracking-wide',
  lg: 'text-sm px-8 py-4 tracking-[0.08em]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-[var(--radius-sm)] uppercase cursor-pointer select-none',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading…</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
