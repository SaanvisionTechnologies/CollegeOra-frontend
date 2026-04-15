"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import OnboardingHeader from "@/components/onboarding-header";
import ProgressBar from "@/components/progress-bar";
import AsymmetricCard from "@/components/asymmetric-card";
import PrimaryButton from "@/components/primary-button";

const features = [
  {
    icon: "auto_awesome",
    iconBg: "bg-[var(--color-primary-fixed)]",
    iconColor: "text-[var(--color-primary)]",
    title: "AI Essay Helper",
    description: "Refine your narrative with institutional precision.",
  },
  {
    icon: "hub",
    iconBg: "bg-[var(--color-secondary-fixed)]",
    iconColor: "text-[var(--color-secondary)]",
    title: "Application Hub",
    description: "A centralized desk for all your documentation.",
  },
  {
    icon: "school",
    iconBg: "bg-[var(--color-tertiary-fixed)]",
    iconColor: "text-[var(--color-tertiary)]",
    title: "College Matching",
    description: "Discover institutions that align with your ethos.",
  },
  {
    icon: "groups",
    iconBg: "bg-[var(--color-surface-container-highest)]",
    iconColor: "text-[var(--color-on-surface)]",
    title: "Peer Network",
    description: "Connect with a community of fellow scholars.",
  },
];

export default function WelcomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const firstName = user?.user_metadata?.full_name?.split(/\s+/)[0] ?? "";

  return (
    <>
      <OnboardingHeader />

      <main className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-4xl w-full">
          {/* Progress + Hero */}
          <div className="mb-12 flex flex-col items-center text-center space-y-4">
            <div className="w-full max-w-xs mb-6">
              <ProgressBar current={1} total={5} label="Phase 01 / Onboarding" />
            </div>

            <h1 className="font-[family-name:var(--font-headline)] text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--color-on-surface)]">
              Welcome to your <br />
              <span className="text-[var(--color-primary)] italic">future{firstName ? `,` : "."}</span>{firstName ? ` ${firstName}.` : ""}
            </h1>

            <p className="text-lg text-[var(--color-on-surface-variant)] max-w-xl mx-auto leading-relaxed font-[family-name:var(--font-body)]">
              The journey to your dream university is a series of intentional
              steps. We&apos;ve curated the tools to help you navigate every
              milestone with precision and prestige.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((f) => (
              <AsymmetricCard key={f.title} className="p-8 flex flex-col items-start space-y-4 border-none">
                <div className={`w-12 h-12 rounded-xl ${f.iconBg} flex items-center justify-center`}>
                  <span className={`material-symbols-outlined ${f.iconColor}`}>
                    {f.icon}
                  </span>
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-headline)] font-bold text-lg mb-1">
                    {f.title}
                  </h3>
                  <p className="font-[family-name:var(--font-label)] text-xs text-[var(--color-on-surface-variant)] leading-snug">
                    {f.description}
                  </p>
                </div>
              </AsymmetricCard>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center space-y-6">
            <PrimaryButton
              onClick={() => router.push("/onboarding/personal-profile")}
              className="px-10 py-4 text-lg"
            >
              Get Started
            </PrimaryButton>

            <div className="flex items-center gap-2 text-[var(--color-on-surface-variant)]/60 font-[family-name:var(--font-label)] text-[10px] uppercase tracking-widest">
              <span>Est. Time: 2 Minutes</span>
              <span className="w-1 h-1 rounded-full bg-[var(--color-outline-variant)]/30" />
              <span>No Documents Required</span>
            </div>
          </div>
        </div>
      </main>

      {/* Decorative blur circles */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[var(--color-primary-fixed)]/20 blur-[120px] rounded-full" />
        <div className="absolute top-[40%] -right-[5%] w-[30%] h-[30%] bg-[var(--color-tertiary-fixed)]/15 blur-[100px] rounded-full" />
      </div>
    </>
  );
}
