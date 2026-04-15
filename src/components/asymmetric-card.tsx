"use client";

interface AsymmetricCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function AsymmetricCard({
  children,
  className = "",
  onClick,
}: AsymmetricCardProps) {
  return (
    <div
      onClick={onClick}
      className={`card-asymmetric bg-[var(--color-surface-container-lowest)] p-6 hover:shadow-[0_8px_24px_rgba(0,93,169,0.08)] hover:-translate-y-0.5 transition-all duration-300 ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
