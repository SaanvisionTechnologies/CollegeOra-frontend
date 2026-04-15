"use client";

interface PillSelectProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
  showClose?: boolean;
}

export default function PillSelect({
  label,
  selected,
  onToggle,
  showClose = false,
}: PillSelectProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-[family-name:var(--font-label)] transition-all duration-200 ${
        selected
          ? "bg-[var(--color-primary)]/10 border border-[var(--color-primary)] text-[var(--color-primary)] font-semibold"
          : "border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] hover:bg-[var(--color-primary)]/5 hover:border-[var(--color-primary)]"
      }`}
    >
      {label}
      {selected && showClose && (
        <span className="material-symbols-outlined text-base leading-none">
          close
        </span>
      )}
    </button>
  );
}
