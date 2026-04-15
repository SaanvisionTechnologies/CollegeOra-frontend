"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth-provider";
import PrimaryButton from "@/components/primary-button";
import AsymmetricCard from "@/components/asymmetric-card";

export default function CompletePage() {
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      supabase
        .from("users")
        .update({ onboarding_completed: true, onboarding_step: 6 })
        .eq("id", user.id)
        .then();
    }
  }, [user]);

  return (
    <>
      {/* Decorative blur circles */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-primary)]/5 rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-tertiary)]/5 rounded-full blur-[120px] -z-10" />

      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 md:py-24 max-w-6xl mx-auto">
        {/* Success Section */}
        <section className="w-full text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-[var(--color-primary)]/10 rounded-full mb-8">
            <span
              className="material-symbols-outlined text-[var(--color-primary)] text-5xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              task_alt
            </span>
          </div>
          <h1 className="font-[family-name:var(--font-headline)] text-4xl md:text-6xl font-extrabold tracking-tighter text-[var(--color-on-surface)] mb-6">
            You&apos;re Ready to Soar.
          </h1>
          <p className="font-[family-name:var(--font-body)] text-lg md:text-xl text-[var(--color-on-surface-variant)] max-w-2xl mx-auto leading-relaxed">
            Your profile is now live. Join a community of over{" "}
            <span className="font-[family-name:var(--font-label)] font-bold text-[var(--color-primary)]">
              50,000+ students
            </span>{" "}
            who are turning their academic dreams into reality.
          </p>
        </section>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-16">
          {/* Card 1 */}
          <AsymmetricCard className="p-8 flex flex-col h-full group">
            <div className="mb-6 flex justify-between items-start">
              <span className="material-symbols-outlined text-[var(--color-primary)] text-3xl">
                badge
              </span>
              <span className="font-[family-name:var(--font-label)] text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-3 py-1 rounded-full">
                Step 1
              </span>
            </div>
            <h3 className="font-[family-name:var(--font-headline)] text-xl font-bold mb-3 text-[var(--color-on-surface)]">
              Complete Your Profile
            </h3>
            <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-on-surface-variant)] flex-grow mb-8">
              Add your extracurriculars and GPA to get personalized university
              matches.
            </p>
            <button className="font-[family-name:var(--font-label)] text-sm font-bold text-[var(--color-primary)] flex items-center group-hover:gap-2 transition-all">
              Finish Setup
              <span className="material-symbols-outlined ml-1">arrow_forward</span>
            </button>
          </AsymmetricCard>

          {/* Card 2 */}
          <AsymmetricCard className="p-8 flex flex-col h-full group">
            <div className="mb-6 flex justify-between items-start">
              <span className="material-symbols-outlined text-[var(--color-tertiary)] text-3xl">
                group
              </span>
              <span className="font-[family-name:var(--font-label)] text-xs font-bold uppercase tracking-widest text-[var(--color-tertiary)] bg-[var(--color-tertiary)]/10 px-3 py-1 rounded-full">
                Recommended
              </span>
            </div>
            <h3 className="font-[family-name:var(--font-headline)] text-xl font-bold mb-3 text-[var(--color-on-surface)]">
              Find a Peer Mentor
            </h3>
            <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-on-surface-variant)] flex-grow mb-8">
              Connect with students who have successfully navigated the process at
              your target schools.
            </p>
            <button className="font-[family-name:var(--font-label)] text-sm font-bold text-[var(--color-tertiary)] flex items-center group-hover:gap-2 transition-all">
              Browse Mentors
              <span className="material-symbols-outlined ml-1">arrow_forward</span>
            </button>
          </AsymmetricCard>

          {/* Card 3 */}
          <AsymmetricCard className="p-8 flex flex-col h-full group">
            <div className="mb-6 flex justify-between items-start">
              <span className="material-symbols-outlined text-[var(--color-secondary)] text-3xl">
                edit_note
              </span>
              <span className="font-[family-name:var(--font-label)] text-xs font-bold uppercase tracking-widest text-[var(--color-secondary)] bg-[var(--color-secondary)]/10 px-3 py-1 rounded-full">
                Jump In
              </span>
            </div>
            <h3 className="font-[family-name:var(--font-headline)] text-xl font-bold mb-3 text-[var(--color-on-surface)]">
              Start Your First Essay
            </h3>
            <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-on-surface-variant)] flex-grow mb-8">
              Use our curator tool to outline your personal statement with
              professional guidance.
            </p>
            <button className="font-[family-name:var(--font-label)] text-sm font-bold text-[var(--color-secondary)] flex items-center group-hover:gap-2 transition-all">
              Open Editor
              <span className="material-symbols-outlined ml-1">arrow_forward</span>
            </button>
          </AsymmetricCard>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-6 w-full max-w-sm">
          <PrimaryButton
            onClick={() => router.push("/dashboard")}
            className="w-full py-5 text-lg"
          >
            Go to Dashboard
          </PrimaryButton>
          <p className="font-[family-name:var(--font-label)] text-xs uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)] opacity-60">
            Welcome to the class of 2028
          </p>
        </div>
      </main>
    </>
  );
}
