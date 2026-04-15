"use client";

import { useAuth } from "@/components/auth-provider";
import LoadingScreen from "@/components/loading-screen";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">{children}</div>
  );
}
