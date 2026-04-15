"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import FormInput from "@/components/form-input";
import PrimaryButton from "@/components/primary-button";

export default function Home() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const signInWithGoogle = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/onboarding/welcome`,
      },
    });
  };

  const signInWithApple = () => {
    supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/onboarding/welcome`,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "signup" && password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    if (mode === "signup") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding/welcome`,
        },
      });
      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
      // Supabase returns a user with empty identities if the email already exists
      if (data.user && data.user.identities?.length === 0) {
        setError("An account with this email already exists. Try logging in instead.");
        setLoading(false);
        return;
      }
      // If email confirmation is required, user won't have a session yet
      if (data.session) {
        router.refresh();
      } else {
        router.push("/verify-email?email=" + encodeURIComponent(email));
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row relative">
      {/* Left Side: Editorial Content */}
      <section className="relative w-full md:w-3/5 min-h-[409px] md:min-h-screen flex items-center p-8 md:p-16 lg:p-24 overflow-hidden bg-[var(--color-surface-container-low)]">
        {/* Dotted pattern background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(var(--color-primary) 0.5px, transparent 0.5px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10 max-w-2xl">
          {/* Brand */}
          <div className="mb-12">
            <span className="font-[family-name:var(--font-label)] text-sm uppercase tracking-wider text-[var(--color-primary)] font-bold">
              CollegeOra
            </span>
          </div>

          {/* Hero */}
          <h1 className="font-[family-name:var(--font-headline)] text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-[var(--color-on-surface)] mb-8 leading-[1.1]">
            The future of{" "}
            <span className="text-[var(--color-primary-container)]">
              academic excellence
            </span>{" "}
            starts here.
          </h1>

          <p className="font-[family-name:var(--font-body)] text-lg md:text-xl text-[var(--color-on-surface-variant)] mb-12 leading-relaxed">
            Join a community of high-achievers and world-class mentors. Your
            curated journey to the world&apos;s elite universities begins with a
            single step.
          </p>

          {/* Testimonial + Trust Badges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Testimonial Card */}
            <div
              className="p-6 bg-[var(--color-surface-container-lowest)] shadow-[0_12px_32px_rgba(27,28,25,0.04)]"
              style={{
                borderTopLeftRadius: "24px",
                borderBottomRightRadius: "24px",
                borderTopRightRadius: "12px",
                borderBottomLeftRadius: "12px",
              }}
            >
              <div className="flex items-center gap-1 mb-4 text-[var(--color-tertiary)]">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <p className="font-[family-name:var(--font-body)] text-sm italic text-[var(--color-on-surface)] mb-4">
                &ldquo;CollegeOra didn&apos;t just help me apply; they helped me
                discover my story.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-surface-container-high)]" />
                <div>
                  <p className="font-[family-name:var(--font-label)] text-xs font-bold uppercase">
                    Elena Vance
                  </p>
                  <p className="font-[family-name:var(--font-label)] text-[10px] text-[var(--color-on-surface-variant)]">
                    Stanford &apos;27
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 p-4 border border-[var(--color-outline-variant)]/15 rounded-xl bg-[var(--color-surface-bright)]/50 backdrop-blur-sm">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-3xl">
                  verified_user
                </span>
                <div>
                  <p className="font-[family-name:var(--font-label)] text-xs font-bold uppercase">
                    Institutional Grade
                  </p>
                  <p className="font-[family-name:var(--font-body)] text-[11px] text-[var(--color-on-surface-variant)]">
                    End-to-end encryption for all documents.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border border-[var(--color-outline-variant)]/15 rounded-xl bg-[var(--color-surface-bright)]/50 backdrop-blur-sm">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-3xl">
                  school
                </span>
                <div>
                  <p className="font-[family-name:var(--font-label)] text-xs font-bold uppercase">
                    Expert Curated
                  </p>
                  <p className="font-[family-name:var(--font-body)] text-[11px] text-[var(--color-on-surface-variant)]">
                    Insights from 500+ ivy-league mentors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative blur circle */}
        <div className="absolute bottom-[-10%] left-[-5%] w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl" />
      </section>

      {/* Right Side: Auth Form */}
      <section className="w-full md:w-2/5 flex flex-col p-8 md:p-12 lg:p-20 bg-[var(--color-surface)] z-20 min-h-screen justify-between">
        <div className="max-w-md w-full mx-auto my-auto">
          {/* Social Login Buttons — always visible */}
          <div className="space-y-6">
            <div>
              <button
                type="button"
                onClick={signInWithGoogle}
                className="w-full flex items-center justify-center gap-3 py-3 border border-[var(--color-outline-variant)]/30 rounded-xl hover:bg-[var(--color-surface-container-low)] transition-colors group"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="font-[family-name:var(--font-label)] text-xs font-bold uppercase group-hover:text-[var(--color-primary)] transition-colors">
                  Continue with Google
                </span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative py-4 flex items-center">
              <div className="flex-grow border-t border-[var(--color-outline-variant)]/30" />
              <span className="flex-shrink mx-4 font-[family-name:var(--font-label)] text-[10px] text-[var(--color-outline)] uppercase tracking-tighter">
                {mode === "signup" ? "or sign up with email" : "or log in with email"}
              </span>
              <div className="flex-grow border-t border-[var(--color-outline-variant)]/30" />
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8 mt-6 text-center md:text-left">
            <h2 className="font-[family-name:var(--font-headline)] text-3xl font-bold tracking-tight text-[var(--color-on-surface)] mb-2">
              {mode === "signup" ? "Create your account" : "Welcome back"}
            </h2>
            <p className="font-[family-name:var(--font-body)] text-[var(--color-on-surface-variant)]">
              {mode === "signup"
                ? "Begin your journey with a few simple details."
                : "Log in to continue where you left off."}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-[var(--color-error-container)] text-[var(--color-on-error-container)] font-[family-name:var(--font-body)] text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <FormInput
              label="Academic Email"
              icon="alternate_email"
              placeholder="jane.doe@university.edu"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div>
              <div className="flex justify-between items-center px-1 mb-2">
                <label className="text-xs uppercase tracking-widest font-[family-name:var(--font-label)] text-[var(--color-on-surface-variant)]">
                  {mode === "signup" ? "Create Password" : "Password"}
                </label>
                {mode === "signup" ? (
                  <span className="font-[family-name:var(--font-label)] text-[10px] text-[var(--color-primary)]">
                    Must be 8+ chars
                  </span>
                ) : (
                  <a
                    href={`/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ""}`}
                    className="font-[family-name:var(--font-label)] text-[10px] text-[var(--color-primary)] hover:underline"
                  >
                    Forgot password?
                  </a>
                )}
              </div>
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
              {mode === "signup" && password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <span className={`flex items-center gap-2 font-[family-name:var(--font-label)] text-xs ${password.length >= 8 ? "text-green-600" : "text-[var(--color-outline)]"}`}>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{password.length >= 8 ? "check_circle" : "circle"}</span>
                    At least 8 characters
                  </span>
                  <span className={`flex items-center gap-2 font-[family-name:var(--font-label)] text-xs ${/[A-Z]/.test(password) ? "text-green-600" : "text-[var(--color-outline)]"}`}>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{/[A-Z]/.test(password) ? "check_circle" : "circle"}</span>
                    One uppercase letter
                  </span>
                  <span className={`flex items-center gap-2 font-[family-name:var(--font-label)] text-xs ${/\d/.test(password) ? "text-green-600" : "text-[var(--color-outline)]"}`}>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{/\d/.test(password) ? "check_circle" : "circle"}</span>
                    One number
                  </span>
                </div>
              )}
            </div>

            {/* Terms — only in signup mode */}
            {mode === "signup" && (
              <div className="flex items-start gap-3 px-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-[var(--color-outline)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]/20 bg-[var(--color-surface-container-highest)]"
                />
                <label
                  htmlFor="terms"
                  className="font-[family-name:var(--font-body)] text-xs text-[var(--color-on-surface-variant)] leading-tight"
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-[var(--color-primary)] hover:underline font-semibold"
                  >
                    Terms of Service
                  </a>{" "}
                  and acknowledge the{" "}
                  <a
                    href="#"
                    className="text-[var(--color-primary)] hover:underline font-semibold"
                  >
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>
            )}

            {/* Submit */}
            <PrimaryButton
              type="submit"
              disabled={loading || (mode === "signup" && !termsAccepted)}
              className="w-full py-4 text-sm uppercase tracking-widest font-[family-name:var(--font-label)]"
            >
              {loading
                ? "Please wait..."
                : mode === "signup"
                ? "Create Account"
                : "Log In"}
            </PrimaryButton>
          </form>

          {/* Toggle mode */}
          <div className="mt-12 text-center">
            <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-on-surface-variant)]">
              {mode === "signup" ? (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setMode("login");
                      setError("");
                    }}
                    className="text-[var(--color-primary)] font-bold hover:underline"
                  >
                    Log in
                  </button>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => {
                      setMode("signup");
                      setError("");
                    }}
                    className="text-[var(--color-primary)] font-bold hover:underline"
                  >
                    Sign up
                  </button>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-10 flex justify-between items-center opacity-40">
          <span className="font-[family-name:var(--font-label)] text-[10px] uppercase tracking-tighter">
            &copy; 2024 CollegeOra Inc.
          </span>
          <div className="flex gap-4">
            <a
              href="#"
              className="font-[family-name:var(--font-label)] text-[10px] uppercase tracking-tighter hover:text-[var(--color-primary)] transition-colors"
            >
              Help
            </a>
            <a
              href="#"
              className="font-[family-name:var(--font-label)] text-[10px] uppercase tracking-tighter hover:text-[var(--color-primary)] transition-colors"
            >
              Privacy
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
