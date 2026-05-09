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
  // slight adjustments: a bit more horizontal padding on small buttons,
  // and slightly reduced heights so CTAs feel balanced without being oversized
  // sm: ~38px height, md: ~46px height, lg: ~52px height
  // add ~8px extra padding per side (~+16px total width) to give breathing room
  sm: 'text-sm px-9 h-[38px] tracking-wide',
  md: 'text-base px-12 h-[46px] tracking-wide',
  lg: 'text-base px-16 h-[52px] tracking-[0.08em]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  children,
  className,
  disabled,
  style,
  ...props
}: ButtonProps) {
  // Keep size classes (font-size + height) separate from padding so we can
  // add an extra uniform amount per side using the CSS variable
  const sizeClassMap: Record<ButtonSize, string> = {
    sm: 'text-sm h-[38px]',
    md: 'text-base h-[46px]',
    lg: 'text-base h-[52px]',
  };

  // base padding values (in px) previously used per size — we'll add the
  // per-side extra via CSS var `--button-extra-side` so final width = base + extra
  const basePaddingPerSide: Record<ButtonSize, number> = {
    sm: 9,
    md: 12,
    lg: 16,
  };

  const paddingInline = `calc(${basePaddingPerSide[size]}px + var(--button-extra-side, 8px))`;
  const mergedStyle = { paddingInline, ...style } as React.CSSProperties;

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-4 font-medium rounded-[var(--radius-md)] uppercase cursor-pointer select-none leading-none whitespace-nowrap',
        variantStyles[variant],
        sizeClassMap[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      style={mergedStyle}
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
