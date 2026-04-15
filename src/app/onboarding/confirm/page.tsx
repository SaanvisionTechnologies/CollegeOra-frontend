"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { createClient } from "@/lib/supabase/client";
import OnboardingHeader from "@/components/onboarding-header";
import ProgressBar from "@/components/progress-bar";
import PrimaryButton from "@/components/primary-button";
import SecondaryButton from "@/components/secondary-button";
import FormInput from "@/components/form-input";

export default function ConfirmPage() {
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  const handleConfirm = async () => {
    if (!user) return;
    await supabase
      .from("users")
      .update({ onboarding_step: 6 })
      .eq("id", user.id);
    router.push("/onboarding/complete");
  };

  return (
    <>
      <OnboardingHeader stepLabel="Step 5 of 5" />

      {/* Close / Skip button */}
      <button
        onClick={handleConfirm}
        className="fixed top-4 right-4 z-[60] w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-surface-container-high)] hover:bg-[var(--color-surface-container-highest)] transition-colors"
        aria-label="Skip to complete"
      >
        <span className="material-symbols-outlined text-[var(--color-on-surface-variant)]">
          close
        </span>
      </button>

      <main className="pt-8 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Progress bar */}
        <div className="mb-12 max-w-xs mx-auto">
          <ProgressBar current={5} total={5} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column */}
          <section className="lg:col-span-7 space-y-10">
            <header>
              <h1 className="font-[family-name:var(--font-headline)] text-4xl font-extrabold tracking-tight mb-4 text-[var(--color-on-surface)]">
                Confirm your enrollment
              </h1>
              <p className="text-[var(--color-on-surface-variant)] text-lg max-w-xl font-[family-name:var(--font-body)]">
                Review your curated plan details and secure your academic path for
                the upcoming application season.
              </p>
            </header>

            {/* Plan Card */}
            <div className="bg-[var(--color-surface-container-low)] p-8 rounded-[24px_12px_24px_12px] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6">
                <span className="material-symbols-outlined text-[var(--color-primary)]/20 text-6xl">
                  school
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div>
                  <span className="font-[family-name:var(--font-label)] text-xs font-bold text-[var(--color-tertiary)] uppercase tracking-[0.2em] mb-2 block">
                    Current Selection
                  </span>
                  <h3 className="font-[family-name:var(--font-headline)] text-2xl font-bold text-[var(--color-on-surface)]">
                    Ivy Strategic Scholar
                  </h3>
                  <p className="text-[var(--color-on-surface-variant)] mt-1">
                    Full-cycle application strategy &amp; 12 university mentorships.
                  </p>
                </div>
                <div className="flex flex-col items-start md:items-end">
                  <span className="font-[family-name:var(--font-headline)] text-3xl font-extrabold text-[var(--color-primary)]">
                    $1,250
                    <span className="text-sm font-normal text-[var(--color-on-surface-variant)]">
                      /year
                    </span>
                  </span>
                  <a
                    href="#"
                    className="text-[var(--color-primary)] font-[family-name:var(--font-label)] text-sm font-bold border-b border-[var(--color-primary)]/30 hover:border-[var(--color-primary)] transition-all mt-2"
                  >
                    Change plan
                  </a>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[var(--color-primary)]">
                  verified_user
                </span>
                <h2 className="font-[family-name:var(--font-headline)] text-xl font-bold">
                  Secure Payment Information
                </h2>
              </div>

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <FormInput
                      label="Cardholder Name"
                      placeholder="Full name as shown on card"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <div className="space-y-2">
                      <label className="block text-xs uppercase tracking-widest font-[family-name:var(--font-label)] text-[var(--color-on-surface-variant)]">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          className="w-full bg-[var(--color-surface-container-highest)] border-none rounded-xl px-4 py-3 text-[var(--color-on-surface)] font-[family-name:var(--font-body)] placeholder:text-[var(--color-on-surface-variant)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <span className="material-symbols-outlined text-base text-[var(--color-on-surface-variant)]">
                            credit_card
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <FormInput
                    label="Expiration Date"
                    placeholder="MM / YY"
                  />
                  <FormInput
                    label="Security Code (CVC)"
                    placeholder="\u2022\u2022\u2022"
                    type="password"
                  />
                </div>

                {/* Billing Address */}
                <div className="pt-4">
                  <h3 className="font-[family-name:var(--font-headline)] text-lg font-bold mb-4">
                    Billing Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <FormInput label="Street Address" placeholder="Street Address" />
                    </div>
                    <FormInput label="City" placeholder="City" />
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput label="State" placeholder="State" />
                      <FormInput label="ZIP" placeholder="ZIP" />
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="pt-6 border-t border-[var(--color-outline-variant)]/15">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div className="relative flex items-center pt-1">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={() => setTermsAccepted(!termsAccepted)}
                        className="h-5 w-5 rounded border-[var(--color-outline-variant)] bg-[var(--color-surface-container-highest)] text-[var(--color-primary)] focus:ring-[var(--color-primary-container)]"
                      />
                    </div>
                    <span className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                      I agree to the{" "}
                      <a href="#" className="text-[var(--color-primary)] hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-[var(--color-primary)] hover:underline">
                        Academic Ethics Agreement
                      </a>
                      . I understand that CollegeOra provides guidance tools and does
                      not guarantee admission results.
                    </span>
                  </label>
                </div>
              </form>

              {/* Back Button */}
              <div className="pt-6">
                <SecondaryButton
                  onClick={() => router.push("/onboarding/interests")}
                  className="flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                  Back
                </SecondaryButton>
              </div>
            </div>
          </section>

          {/* Right Column — Order Summary */}
          <aside className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="bg-[var(--color-surface-container-low)] rounded-3xl p-8 space-y-8">
              <h2 className="font-[family-name:var(--font-headline)] text-2xl font-bold">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-[var(--color-on-surface-variant)]">
                  <span className="font-[family-name:var(--font-body)]">
                    Ivy Strategic Scholar (Annual)
                  </span>
                  <span className="font-[family-name:var(--font-label)]">$1,250.00</span>
                </div>
                <div className="flex justify-between items-center text-[var(--color-on-surface-variant)]">
                  <span className="font-[family-name:var(--font-body)]">
                    Admissions Resource Pack
                  </span>
                  <span className="font-[family-name:var(--font-label)] text-[var(--color-primary)]">
                    Included
                  </span>
                </div>
                <div className="flex justify-between items-center text-[var(--color-on-surface-variant)]">
                  <span className="font-[family-name:var(--font-body)]">Processing Fee</span>
                  <span className="font-[family-name:var(--font-label)]">$0.00</span>
                </div>

                {/* Promo Code */}
                <div className="pt-4">
                  <label className="font-[family-name:var(--font-label)] text-[10px] uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-2 block">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/20 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[var(--color-primary)]/10 focus:outline-none"
                    />
                    <button className="bg-[var(--color-surface-container-high)] px-4 py-2 rounded-lg font-[family-name:var(--font-label)] text-xs font-bold text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-highest)] transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="pt-6 border-t border-[var(--color-outline-variant)]/30">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <p className="text-sm text-[var(--color-on-surface-variant)]">
                      Total Amount Due
                    </p>
                    <p className="font-[family-name:var(--font-label)] text-[10px] text-[var(--color-tertiary)] mt-1">
                      Billed annually
                    </p>
                  </div>
                  <span className="font-[family-name:var(--font-headline)] text-4xl font-extrabold text-[var(--color-on-surface)]">
                    $1,250.00
                  </span>
                </div>

                <PrimaryButton
                  onClick={handleConfirm}
                  className="w-full py-5 text-lg flex items-center justify-center gap-3"
                >
                  Confirm &amp; Start Journey
                  <span className="material-symbols-outlined">arrow_forward</span>
                </PrimaryButton>

                {/* Payment Icons */}
                <div className="mt-6 flex flex-col items-center gap-4">
                  <p className="text-xs font-[family-name:var(--font-label)] text-[var(--color-on-surface-variant)] opacity-40 tracking-wide">
                    Visa &bull; Mastercard &bull; Amex
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-[family-name:var(--font-label)] uppercase tracking-widest text-[var(--color-on-surface-variant)]/60">
                    <span className="material-symbols-outlined text-sm">lock</span>
                    SSL Encrypted &amp; Secure Payment
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="mt-8 p-6 bg-[var(--color-tertiary)]/5 rounded-2xl border border-[var(--color-tertiary)]/10">
              <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-tertiary-container)] italic leading-relaxed">
                &ldquo;Choosing this plan was the turning point in my application
                process. The mentorship alone was worth ten times the
                investment.&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-tertiary-fixed)] flex items-center justify-center text-xs font-bold text-[var(--color-tertiary)]">
                  SA
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--color-on-surface)]">
                    Sarah A.
                  </p>
                  <p className="text-[10px] text-[var(--color-on-surface-variant)] font-[family-name:var(--font-label)] uppercase">
                    Stanford &apos;27 Candidate
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
