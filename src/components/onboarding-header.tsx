"use client";

interface OnboardingHeaderProps {
  stepLabel?: string;
}

export default function OnboardingHeader({ stepLabel }: OnboardingHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-[var(--color-surface)]/80 border-b border-[var(--color-outline-variant)]/20">
      <span className="text-xl font-bold font-[family-name:var(--font-headline)] text-[var(--color-primary)]">
        CollegeOra
      </span>
      {stepLabel && (
        <span className="text-sm font-[family-name:var(--font-label)] text-[var(--color-on-surface-variant)] tracking-wide">
          {stepLabel}
        </span>
      )}
    </header>
  );
}
