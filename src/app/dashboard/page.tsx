"use client";

import { useAuth } from "@/components/auth-provider";
import LoadingScreen from "@/components/loading-screen";
import PrimaryButton from "@/components/primary-button";

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-[var(--color-surface)]">
      <div className="text-center max-w-md">
        <span
          className="material-symbols-outlined text-[var(--color-primary)] text-6xl mb-6 block"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          dashboard
        </span>
        <h1 className="font-[family-name:var(--font-headline)] text-3xl font-extrabold tracking-tight text-[var(--color-on-surface)] mb-3">
          Welcome{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}
        </h1>
        <p className="font-[family-name:var(--font-body)] text-[var(--color-on-surface-variant)] mb-2">
          {user?.email}
        </p>
        <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-outline)] mb-10">
          Your dashboard is coming soon.
        </p>
        <PrimaryButton onClick={signOut} className="px-10 py-3">
          Sign Out
        </PrimaryButton>
      </div>
    </main>
  );
}
