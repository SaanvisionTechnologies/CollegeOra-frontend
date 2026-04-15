"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import FormInput from "@/components/form-input";
import PrimaryButton from "@/components/primary-button";
import LoadingScreen from "@/components/loading-screen";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ForgotPasswordContent />
    </Suspense>
  );
}

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-[var(--color-surface)]">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <span className="font-[family-name:var(--font-label)] text-sm uppercase tracking-wider text-[var(--color-primary)] font-bold">
            CollegeOra
          </span>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-4 bg-[var(--color-primary)]/10 rounded-full mb-8">
              <span
                className="material-symbols-outlined text-[var(--color-primary)] text-5xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                mail
              </span>
            </div>
            <h1 className="font-[family-name:var(--font-headline)] text-3xl font-extrabold tracking-tight text-[var(--color-on-surface)] mb-4">
              Check your email
            </h1>
            <p className="font-[family-name:var(--font-body)] text-[var(--color-on-surface-variant)] mb-2">
              We sent a password reset link to
            </p>
            <p className="font-[family-name:var(--font-label)] text-sm font-bold text-[var(--color-primary)] mb-8">
              {email}
            </p>
            <Link
              href="/"
              className="font-[family-name:var(--font-label)] text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
            >
              ← Back to login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-[family-name:var(--font-headline)] text-3xl font-extrabold tracking-tight text-[var(--color-on-surface)] mb-3 text-center">
              Reset your password
            </h1>
            <p className="font-[family-name:var(--font-body)] text-[var(--color-on-surface-variant)] text-center mb-8">
              Enter your email and we&apos;ll send you a reset link.
            </p>

            {error && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-[var(--color-error-container)] text-[var(--color-on-error-container)] font-[family-name:var(--font-body)] text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                label="Email"
                icon="alternate_email"
                placeholder="jane.doe@university.edu"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <PrimaryButton
                type="submit"
                disabled={loading || !email}
                className="w-full py-4 text-sm uppercase tracking-widest font-[family-name:var(--font-label)]"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </PrimaryButton>
            </form>

            <div className="mt-8 text-center">
              <Link
                href="/"
                className="font-[family-name:var(--font-label)] text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
              >
                ← Back to login
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
