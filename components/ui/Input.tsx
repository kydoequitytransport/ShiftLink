import { cn } from '@/lib/utils';
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function Input({ label, hint, error, className, id, style, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  // Base per-side and vertical paddings (px) — final padding = base + --input-extra-* vars
  const baseInline = 20; // ~ previously px-5 (20px)
  const baseBlock = 12; // previously py-3 (12px)

  const paddingInline = `calc(${baseInline}px + var(--input-extra-side, 8px))`;
  const paddingBlock = `calc(${baseBlock}px + var(--input-extra-vertical, 4px))`;
  const mergedStyle = { paddingInline, paddingBlock, ...style } as React.CSSProperties;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium uppercase tracking-widest text-[var(--color-ink-muted)]"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full bg-[var(--color-white)] border rounded-[var(--radius-md)]',
          'text-base text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)]',
          'focus:outline-none focus:ring-1',
          error
            ? 'border-red-400 focus:ring-red-300'
            : 'border-[var(--color-border)] focus:border-[var(--color-sage)] focus:ring-[var(--color-sage-light)]',
          className
        )}
        style={mergedStyle}
        {...props}
      />
      {hint && !error && (
        <p className="text-xs text-[var(--color-ink-faint)]">{hint}</p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
