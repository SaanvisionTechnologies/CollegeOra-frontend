"use client";

interface SecondaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function SecondaryButton({
  children,
  onClick,
  className = "",
}: SecondaryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-8 py-3 rounded-xl bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] font-medium font-[family-name:var(--font-headline)] hover:opacity-90 active:scale-[0.98] transition-all duration-200 ${className}`}
    >
      {children}
    </button>
  );
}
