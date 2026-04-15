"use client";

import { type ChangeEvent } from "react";

interface FormTextareaProps {
  label: string;
  placeholder?: string;
  maxLength?: number;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function FormTextarea({
  label,
  placeholder,
  maxLength,
  value = "",
  onChange,
}: FormTextareaProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs uppercase tracking-widest font-[family-name:var(--font-label)] text-[var(--color-on-surface-variant)]">
        {label}
      </label>
      <div className="relative">
        <textarea
          placeholder={placeholder}
          maxLength={maxLength}
          value={value}
          onChange={onChange}
          rows={4}
          className="w-full rounded-xl border-none bg-[var(--color-surface-container-highest)] px-4 py-3 text-[var(--color-on-surface)] font-[family-name:var(--font-body)] placeholder:text-[var(--color-on-surface-variant)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-200 resize-none"
        />
        {maxLength && (
          <span className="absolute bottom-3 right-3 text-xs font-[family-name:var(--font-label)] text-[var(--color-on-surface-variant)]">
            {value.length} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
