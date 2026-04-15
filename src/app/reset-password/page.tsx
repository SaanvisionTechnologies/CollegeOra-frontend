"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import PrimaryButton from "@/components/primary-button";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!hasMinLength || !hasUppercase || !hasNumber) {
      setError("Password doesn't meet requirements.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/");
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-[var(--color-surface)]">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <span className="font-[family-name:var(--font-label)] text-sm uppercase tracking-wider text-[var(--color-primary)] font-bold">
            CollegeOra
          </span>
        </div>

        <h1 className="font-[family-name:var(--font-headline)] text-3xl font-extrabold tracking-tight text-[var(--color-on-surface)] mb-3 text-center">
          Set new password
        </h1>
        <p className="font-[family-name:var(--font-body)] text-[var(--color-on-surface-variant)] text-center mb-8">
          Choose a strong password for your account.
        </p>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-[var(--color-error-container)] text-[var(--color-on-error-container)] font-[family-name:var(--font-body)] text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest font-[family-name:var(--font-label)] text-[var(--color-on-surface-variant)] mb-2">
              New Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] text-lg">
                lock
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border-none bg-[var(--color-surface-container-highest)] pl-10 pr-4 py-3 text-[var(--color-on-surface)] font-[family-name:var(--font-body)] placeholder:text-[var(--color-on-surface-variant)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-200"
              />
            </div>
            {password.length > 0 && (
              <div className="mt-2 space-y-1">
                <PasswordRule met={hasMinLength} label="At least 8 characters" />
                <PasswordRule met={hasUppercase} label="One uppercase letter" />
                <PasswordRule met={hasNumber} label="One number" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-[family-name:var(--font-label)] text-[var(--color-on-surface-variant)] mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] text-lg">
                lock
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border-none bg-[var(--color-surface-container-highest)] pl-10 pr-4 py-3 text-[var(--color-on-surface)] font-[family-name:var(--font-body)] placeholder:text-[var(--color-on-surface-variant)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-200"
              />
            </div>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="mt-2 text-xs text-[var(--color-error)] font-[family-name:var(--font-label)]">
                Passwords don&apos;t match
              </p>
            )}
          </div>

          <PrimaryButton
            type="submit"
            disabled={loading || !hasMinLength || !hasUppercase || !hasNumber || !passwordsMatch}
            className="w-full py-4 text-sm uppercase tracking-widest font-[family-name:var(--font-label)]"
          >
            {loading ? "Updating..." : "Update Password"}
          </PrimaryButton>
        </form>
      </div>
    </main>
  );
}

function PasswordRule({ met, label }: { met: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`material-symbols-outlined text-sm ${
          met ? "text-green-600" : "text-[var(--color-outline)]"
        }`}
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        {met ? "check_circle" : "circle"}
      </span>
      <span
        className={`font-[family-name:var(--font-label)] text-xs ${
          met ? "text-green-600" : "text-[var(--color-outline)]"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
