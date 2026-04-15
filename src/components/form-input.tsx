"use client";

import { type ChangeEvent } from "react";

interface FormInputProps {
  label: string;
  icon?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function FormInput({
  label,
  icon,
  placeholder,
  type = "text",
  value,
  onChange,
  className = "",
}: FormInputProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-xs uppercase tracking-widest font-[family-name:var(--font-label)] text-[var(--color-on-surface-variant)]">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] text-lg">
            {icon}
          </span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full rounded-xl border-none bg-[var(--color-surface-container-highest)] px-4 py-3 text-[var(--color-on-surface)] font-[family-name:var(--font-body)] placeholder:text-[var(--color-on-surface-variant)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-200 ${icon ? "pl-10" : ""}`}
        />
      </div>
    </div>
  );
}
