"use client";

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export default function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        {label && (
          <span className="text-xs font-[family-name:var(--font-label)] text-[var(--color-on-surface-variant)] uppercase tracking-widest">
            {label}
          </span>
        )}
        <span className="text-xs font-[family-name:var(--font-label)] text-[var(--color-on-surface-variant)] ml-auto">
          {current} / {total}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-[var(--color-surface-container-highest)] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-container)] transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
