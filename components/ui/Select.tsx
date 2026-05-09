import { cn } from '@/lib/utils';
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({ label, error, options, placeholder, className, id, style, ...props }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const baseInline = 20;
  const baseBlock = 12;
  const paddingInline = `calc(${baseInline}px + var(--input-extra-side, 8px))`;
  const paddingBlock = `calc(${baseBlock}px + var(--input-extra-vertical, 4px))`;
  const mergedStyle = {
    paddingInline,
    paddingBlock,
    ...style,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B6B65' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right calc(14px + var(--input-extra-side, 8px)) center',
  } as React.CSSProperties;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-medium uppercase tracking-widest text-[var(--color-ink-muted)]"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'w-full bg-[var(--color-white)] border rounded-[var(--radius-md)]',
          'text-base text-[var(--color-ink)] appearance-none cursor-pointer',
          'focus:outline-none focus:ring-1',
          error
            ? 'border-red-400 focus:ring-red-300'
            : 'border-[var(--color-border)] focus:border-[var(--color-sage)] focus:ring-[var(--color-sage-light)]',
          className
        )}
        style={mergedStyle}
        {...props}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
