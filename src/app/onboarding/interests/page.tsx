"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { useAutoSave } from "@/lib/hooks/use-auto-save";
import SaveIndicator from "@/components/save-indicator";
import OnboardingHeader from "@/components/onboarding-header";
import ProgressBar from "@/components/progress-bar";
import PrimaryButton from "@/components/primary-button";
import SecondaryButton from "@/components/secondary-button";
import PillSelect from "@/components/pill-select";

interface Activity {
  id?: string;
  title: string;
  subtitle: string;
  activity_type: "extracurricular" | "award";
}

const INTEREST_OPTIONS = [
  "Computer Science",
  "Economics",
  "Psychology",
  "Biology",
  "Political Science",
  "Mathematics",
  "Engineering",
  "Literature",
];

const AMBITION_OPTIONS = [
  "Entrepreneurship",
  "Software Engineering",
  "Research",
  "Medicine",
  "Law",
  "Finance",
];

const HELP_OPTIONS = [
  "Application Essays",
  "Standardized Tests",
  "Financial Aid",
  "College Interviews",
  "Summer Programs",
  "Portfolio Reviews",
];

export default function InterestsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();

  const [extracurriculars, setExtracurriculars] = useState<Activity[]>([]);
  const [newActivity, setNewActivity] = useState("");
  const [awards, setAwards] = useState<Activity[]>([]);
  const [newAward, setNewAward] = useState("");
  const [academicInterests, setAcademicInterests] = useState<string[]>([]);
  const [careerAmbitions, setCareerAmbitions] = useState<string[]>([]);
  const [helpAreas, setHelpAreas] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load existing data
  useEffect(() => {
    if (!user) return;

    Promise.all([
      supabase
        .from("user_activities")
        .select("id, title, subtitle, activity_type")
        .eq("user_id", user.id)
        .order("sort_order"),
      supabase
        .from("user_preferences")
        .select("academic_interests, career_ambitions, help_areas")
        .eq("user_id", user.id)
        .single(),
    ]).then(([activitiesRes, prefsRes]) => {
      if (activitiesRes.data) {
        setExtracurriculars(
          activitiesRes.data
            .filter((a) => a.activity_type === "extracurricular")
            .map((a) => ({ id: a.id, title: a.title, subtitle: a.subtitle ?? "", activity_type: "extracurricular" }))
        );
        setAwards(
          activitiesRes.data
            .filter((a) => a.activity_type === "award")
            .map((a) => ({ id: a.id, title: a.title, subtitle: a.subtitle ?? "", activity_type: "award" }))
        );
      }
      if (prefsRes.data) {
        setAcademicInterests(prefsRes.data.academic_interests ?? []);
        setCareerAmbitions(prefsRes.data.career_ambitions ?? []);
        setHelpAreas(prefsRes.data.help_areas ?? []);
      }
      setLoaded(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Auto-save preferences
  const savePrefs = useCallback(async () => {
    if (!user || !loaded) return;
    await supabase
      .from("user_preferences")
      .upsert(
        {
          user_id: user.id,
          academic_interests: academicInterests,
          career_ambitions: careerAmbitions,
          help_areas: helpAreas,
        },
        { onConflict: "user_id" }
      );
  }, [user, loaded, academicInterests, careerAmbitions, helpAreas, supabase]);

  const saveStatus = useAutoSave(savePrefs, [
    academicInterests,
    careerAmbitions,
    helpAreas,
  ]);

  // Activity helpers (save immediately on add/remove)
  const addActivity = async () => {
    if (!newActivity.trim() || !user) return;
    const { data } = await supabase
      .from("user_activities")
      .insert({
        user_id: user.id,
        activity_type: "extracurricular",
        title: newActivity.trim(),
        subtitle: "",
        sort_order: extracurriculars.length,
      })
      .select("id, title, subtitle, activity_type")
      .single();
    if (data) {
      setExtracurriculars((prev) => [...prev, { id: data.id, title: data.title, subtitle: data.subtitle ?? "", activity_type: "extracurricular" }]);
    }
    setNewActivity("");
  };

  const removeActivity = async (index: number) => {
    const item = extracurriculars[index];
    if (item.id) {
      await supabase.from("user_activities").delete().eq("id", item.id);
    }
    setExtracurriculars((prev) => prev.filter((_, i) => i !== index));
  };

  const addAward = async () => {
    if (!newAward.trim() || !user) return;
    const { data } = await supabase
      .from("user_activities")
      .insert({
        user_id: user.id,
        activity_type: "award",
        title: newAward.trim(),
        subtitle: "Award",
        sort_order: awards.length,
      })
      .select("id, title, subtitle, activity_type")
      .single();
    if (data) {
      setAwards((prev) => [...prev, { id: data.id, title: data.title, subtitle: data.subtitle ?? "", activity_type: "award" }]);
    }
    setNewAward("");
  };

  const removeAward = async (index: number) => {
    const item = awards[index];
    if (item.id) {
      await supabase.from("user_activities").delete().eq("id", item.id);
    }
    setAwards((prev) => prev.filter((_, i) => i !== index));
  };

  // Pill toggles
  const toggleInterest = (interest: string) => {
    setAcademicInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const toggleAmbition = (ambition: string) => {
    setCareerAmbitions((prev) =>
      prev.includes(ambition) ? prev.filter((a) => a !== ambition) : [...prev, ambition]
    );
  };

  const toggleHelp = (area: string) => {
    setHelpAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleContinue = async () => {
    if (!user) return;
    await supabase
      .from("users")
      .update({ onboarding_step: 5 })
      .eq("id", user.id);
    router.push("/onboarding/confirm");
  };

  return (
    <>
      <OnboardingHeader stepLabel="Step 4 of 5 — Interests & Goals" />

      <main className="pt-8 pb-32 min-h-screen px-4">
        <div className="max-w-4xl mx-auto">
          {/* Progress */}
          <div className="mb-12 max-w-xs mx-auto">
            <div className="flex justify-end mb-2">
              <SaveIndicator status={saveStatus} />
            </div>
            <ProgressBar current={4} total={5} />
          </div>

          <div className="space-y-12">
            {/* Hero */}
            <div className="text-center space-y-3">
              <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-headline)] font-extrabold tracking-tight text-[var(--color-on-surface)]">
                Tell us what{" "}
                <span className="text-[var(--color-primary)] italic">drives</span>{" "}
                you.
              </h1>
              <p className="text-[var(--color-on-surface-variant)] max-w-xl mx-auto font-[family-name:var(--font-body)]">
                Your extracurriculars and career ambitions help us curate the most
                relevant institutional matches for your unique profile.
              </p>
            </div>

            {/* Extracurriculars */}
            <section className="bg-[var(--color-surface-container-lowest)] rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-[var(--color-primary)]">
                  diversity_3
                </span>
                <h2 className="text-xl font-[family-name:var(--font-headline)] font-bold">
                  Extracurriculars
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  {extracurriculars.map((item, i) => (
                    <div
                      key={item.id ?? i}
                      className="flex items-center gap-2 bg-[var(--color-surface-container-low)] px-4 py-2 rounded-xl border-l-4 border-[var(--color-primary)]"
                    >
                      <span className="text-sm font-medium">{item.title}</span>
                      <button
                        onClick={() => removeActivity(i)}
                        className="material-symbols-outlined text-sm text-[var(--color-outline)] hover:text-[var(--color-error)]"
                      >
                        close
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newActivity}
                    onChange={(e) => setNewActivity(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addActivity()}
                    placeholder="Add an activity (e.g. Robotics, Piano...)"
                    className="flex-1 bg-[var(--color-surface-container-high)] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:outline-none placeholder:text-[var(--color-outline)] font-[family-name:var(--font-body)]"
                  />
                  <button
                    onClick={addActivity}
                    className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl font-[family-name:var(--font-label)] text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all active:scale-95"
                  >
                    Add
                  </button>
                </div>
              </div>
            </section>

            {/* Awards & Honors */}
            <section className="bg-[var(--color-surface-container-low)] rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-[var(--color-tertiary)]">
                  military_tech
                </span>
                <h2 className="text-xl font-[family-name:var(--font-headline)] font-bold">
                  Awards &amp; Honors
                </h2>
              </div>
              <div className="space-y-4">
                {awards.map((award, i) => (
                  <div
                    key={award.id ?? i}
                    className="bg-[var(--color-surface-container-lowest)] p-4 rounded-xl flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-sm">{award.title}</p>
                      <p className="text-xs text-[var(--color-outline)] font-[family-name:var(--font-label)] uppercase">
                        {award.subtitle}
                      </p>
                    </div>
                    <button
                      onClick={() => removeAward(i)}
                      className="material-symbols-outlined text-[var(--color-outline)] hover:text-[var(--color-error)]"
                    >
                      delete
                    </button>
                  </div>
                ))}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newAward}
                    onChange={(e) => setNewAward(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addAward()}
                    placeholder="Award name..."
                    className="flex-1 bg-[var(--color-surface-container-highest)] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:outline-none placeholder:text-[var(--color-outline)] font-[family-name:var(--font-body)]"
                  />
                  <button
                    onClick={addAward}
                    className="bg-[var(--color-on-surface)] text-[var(--color-surface)] px-6 py-3 rounded-xl font-[family-name:var(--font-label)] text-xs font-bold uppercase tracking-widest transition-all active:scale-95"
                  >
                    Add
                  </button>
                </div>
              </div>
            </section>

            {/* Academic Interests & Career Ambitions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="bg-[var(--color-surface-container-lowest)] rounded-3xl p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-[family-name:var(--font-headline)] font-bold mb-1">
                    Academic Interests
                  </h2>
                  <p className="text-xs text-[var(--color-outline)] font-[family-name:var(--font-label)] uppercase">
                    Select all that apply
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((interest) => (
                    <PillSelect
                      key={interest}
                      label={interest}
                      selected={academicInterests.includes(interest)}
                      onToggle={() => toggleInterest(interest)}
                    />
                  ))}
                </div>
              </section>

              <section className="bg-[var(--color-surface-container-lowest)] rounded-3xl p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-[family-name:var(--font-headline)] font-bold mb-1">
                    Career Ambitions
                  </h2>
                  <p className="text-xs text-[var(--color-outline)] font-[family-name:var(--font-label)] uppercase">
                    Your future goals
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {AMBITION_OPTIONS.map((ambition) => (
                    <PillSelect
                      key={ambition}
                      label={ambition}
                      selected={careerAmbitions.includes(ambition)}
                      onToggle={() => toggleAmbition(ambition)}
                    />
                  ))}
                </div>
              </section>
            </div>

            {/* Help Areas */}
            <section className="bg-[var(--color-surface-container-low)] rounded-3xl p-8">
              <div className="mb-8 max-w-lg">
                <h2 className="text-xl font-[family-name:var(--font-headline)] font-bold mb-2">
                  What do you need most help with?
                </h2>
                <p className="text-[var(--color-on-surface-variant)] text-sm font-[family-name:var(--font-body)]">
                  Select the areas where you&apos;d like CollegeOra to provide
                  deep-dive resources and mentorship.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {HELP_OPTIONS.map((area) => (
                  <label
                    key={area}
                    className="group flex items-center gap-4 bg-[var(--color-surface-container-lowest)] p-4 rounded-xl cursor-pointer hover:ring-2 hover:ring-[var(--color-primary)]/20 transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={helpAreas.includes(area)}
                      onChange={() => toggleHelp(area)}
                      className="w-5 h-5 rounded border-[var(--color-outline-variant)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    />
                    <span className="text-sm font-medium">{area}</span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-8">
            <SecondaryButton
              onClick={() => router.push("/onboarding/academic-profile")}
              className="flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Back
            </SecondaryButton>
            <PrimaryButton
              onClick={handleContinue}
              className="px-10 py-4 text-lg"
            >
              Continue to Final Step
            </PrimaryButton>
          </div>
        </div>
      </main>
    </>
  );
}
