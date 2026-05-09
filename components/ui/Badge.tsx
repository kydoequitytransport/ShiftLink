import { cn } from '@/lib/utils';

type BadgeVariant = 'sage' | 'accent' | 'urgent' | 'muted' | 'ink';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  sage: 'bg-[var(--color-sage-light)] text-[var(--color-sage-dark)]',
  accent: 'bg-[var(--color-accent-light)] text-[var(--color-accent)]',
  urgent: 'bg-orange-50 text-[var(--color-urgent)]',
  muted: 'bg-[var(--color-parchment)] text-[var(--color-ink-muted)]',
  ink: 'bg-[var(--color-ink)] text-[var(--color-cream)]',
};

export function Badge({ children, variant = 'muted', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-[var(--radius-sm)] text-xs font-medium tracking-wide uppercase',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
