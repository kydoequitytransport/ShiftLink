import { cn } from '@/lib/utils';

interface DividerProps {
  className?: string;
  label?: string;
}

export function Divider({ className, label }: DividerProps) {
  if (label) {
    return (
      <div className={cn('flex items-center gap-4', className)}>
        <div className="flex-1 h-px bg-[var(--color-border)]" />
        <span className="text-xs text-[var(--color-ink-faint)] uppercase tracking-widest">{label}</span>
        <div className="flex-1 h-px bg-[var(--color-border)]" />
      </div>
    );
  }
  return <hr className={cn('border-none h-px bg-[var(--color-border)]', className)} />;
}
