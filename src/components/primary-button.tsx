"use client";

import { type ButtonHTMLAttributes } from "react";

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  disabled?: boolean;
}

export default function PrimaryButton({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`academic-gradient px-8 py-3 rounded-xl text-white font-bold font-[family-name:var(--font-headline)] shadow-[0_8px_20px_rgba(0,93,169,0.2)] hover:shadow-[0_12px_28px_rgba(0,93,169,0.3)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none ${className}`}
    >
      {children}
    </button>
  );
}
