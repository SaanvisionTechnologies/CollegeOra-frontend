"use client";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-surface)]">
      <span className="font-[family-name:var(--font-label)] text-lg uppercase tracking-wider text-[var(--color-primary)] font-bold animate-pulse">
        CollegeOra
      </span>
    </div>
  );
}
