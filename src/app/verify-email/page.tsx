"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import PrimaryButton from "@/components/primary-button";
import LoadingScreen from "@/components/loading-screen";
import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") ?? "";
  const supabase = createClient();
  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        router.push("/onboarding/welcome");
      }
    });
    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const handleResend = async () => {
    setLoading(true);
    await supabase.auth.resend({ type: "signup", email });
    setResent(true);
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-[var(--color-surface)]">
      <div className="max-w-md w-full text-center">
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
          We sent a verification link to
        </p>
        <p className="font-[family-name:var(--font-label)] text-sm font-bold text-[var(--color-primary)] mb-8">
          {email}
        </p>

        <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-outline)] mb-8">
          Click the link in the email to verify your account and get started.
          Check your spam folder if you don&apos;t see it.
        </p>

        {resent ? (
          <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-primary)] mb-8">
            Verification email resent.
          </p>
        ) : (
          <PrimaryButton
            onClick={handleResend}
            disabled={loading}
            className="px-8 py-3 mb-4"
          >
            {loading ? "Sending..." : "Resend Email"}
          </PrimaryButton>
        )}

        <div className="mt-6">
          <Link
            href="/"
            className="font-[family-name:var(--font-label)] text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
          >
            ← Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}
