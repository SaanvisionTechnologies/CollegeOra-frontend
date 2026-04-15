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

const courseOptions = [
  "AP Calculus BC",
  "AP Biology",
  "AP U.S. History",
  "AP English Lit",
  "AP Physics",
  "IB Economics",
  "AP Computer Science",
  "IB Biology",
  "AP Chemistry",
];

export default function AcademicProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();

  const [schoolName, setSchoolName] = useState("");
  const [graduationYear, setGraduationYear] = useState("2026");
  const [gpaValue, setGpaValue] = useState("");
  const [gpaType, setGpaType] = useState<"weighted" | "unweighted">("weighted");
  const [satEbrw, setSatEbrw] = useState("");
  const [satMath, setSatMath] = useState("");
  const [actEnglish, setActEnglish] = useState("");
  const [actMath, setActMath] = useState("");
  const [actReading, setActReading] = useState("");
  const [actScience, setActScience] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load existing data
  useEffect(() => {
    if (!user) return;
    supabase
      .from("academic_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setSchoolName(data.school_name ?? "");
          setGraduationYear(data.graduation_year?.toString() ?? "2026");
          setGpaValue(data.gpa_value?.toString() ?? "");
          setGpaType(data.gpa_type ?? "weighted");
          setSatEbrw(data.sat_ebrw?.toString() ?? "");
          setSatMath(data.sat_math?.toString() ?? "");
          setActEnglish(data.act_english?.toString() ?? "");
          setActMath(data.act_math?.toString() ?? "");
          setActReading(data.act_reading?.toString() ?? "");
          setActScience(data.act_science?.toString() ?? "");
          setSelectedCourses(data.courses ?? []);
        }
        setLoaded(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const toggleCourse = (course: string) => {
    setSelectedCourses((prev) =>
      prev.includes(course)
        ? prev.filter((c) => c !== course)
        : [...prev, course]
    );
  };

  // Auto-save
  const saveFn = useCallback(async () => {
    if (!user || !loaded) return;
    await supabase.from("academic_profiles").upsert(
      {
        user_id: user.id,
        school_name: schoolName || null,
        graduation_year: graduationYear ? parseInt(graduationYear) : null,
        gpa_value: gpaValue ? parseFloat(gpaValue) : null,
        gpa_type: gpaType,
        sat_ebrw: satEbrw ? parseInt(satEbrw) : null,
        sat_math: satMath ? parseInt(satMath) : null,
        act_english: actEnglish ? parseInt(actEnglish) : null,
        act_math: actMath ? parseInt(actMath) : null,
        act_reading: actReading ? parseInt(actReading) : null,
        act_science: actScience ? parseInt(actScience) : null,
        courses: selectedCourses,
      },
      { onConflict: "user_id" }
    );
  }, [
    user, loaded, supabase, schoolName, graduationYear, gpaValue, gpaType,
    satEbrw, satMath, actEnglish, actMath, actReading, actScience, selectedCourses,
  ]);

  const saveStatus = useAutoSave(saveFn, [
    schoolName, graduationYear, gpaValue, gpaType,
    satEbrw, satMath, actEnglish, actMath, actReading, actScience, selectedCourses,
  ]);

  // Continue
  const handleContinue = async () => {
    if (!user) return;
    await supabase
      .from("users")
      .update({ onboarding_step: 4 })
      .eq("id", user.id);
    router.push("/onboarding/interests");
  };

  return (
    <>
      <OnboardingHeader stepLabel="Step 3 of 5" />

      <main className="pt-8 pb-20 px-6 max-w-3xl mx-auto">
        {/* Progress */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="font-[family-name:var(--font-label)] text-xs uppercase tracking-widest text-[var(--color-tertiary)] mb-1 block">
                Verification Phase
              </span>
              <h1 className="text-3xl font-[family-name:var(--font-headline)] font-extrabold tracking-tight text-[var(--color-on-surface)]">
                Academic Profile
              </h1>
            </div>
            <div className="text-right flex flex-col items-end gap-1">
              <span className="font-[family-name:var(--font-label)] text-xl font-bold text-[var(--color-primary)]">
                60%
              </span>
              <SaveIndicator status={saveStatus} />
            </div>
          </div>
          <ProgressBar current={3} total={5} label="Verification Phase" />
        </div>

        {/* Main Form Card */}
        <div className="card-asymmetric bg-[var(--color-surface-container-lowest)] p-8 md:p-12 shadow-[0_12px_32px_rgba(27,28,25,0.04)]">
          <form className="space-y-10">
            {/* Institutional Context */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-[var(--color-primary)]">
                  school
                </span>
                <h2 className="font-[family-name:var(--font-headline)] font-bold text-lg">
                  Institutional Context
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block font-[family-name:var(--font-label)] text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
                    Current School Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for your high school..."
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="w-full bg-[var(--color-surface-container-low)] border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-[var(--color-primary)]/20 text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)]/50 transition-all"
                    />
                    <span className="absolute right-3 top-3 material-symbols-outlined text-[var(--color-outline)]/50">
                      search
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block font-[family-name:var(--font-label)] text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
                    Graduation Year
                  </label>
                  <select
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    className="w-full bg-[var(--color-surface-container-low)] border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-[var(--color-primary)]/20 text-[var(--color-on-surface)] transition-all appearance-none"
                  >
                    <option>2025</option>
                    <option>2026</option>
                    <option>2027</option>
                    <option>2028</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Performance Metrics */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-[var(--color-primary)]">
                  analytics
                </span>
                <h2 className="font-[family-name:var(--font-headline)] font-bold text-lg">
                  Performance Metrics
                </h2>
              </div>
              <div className="p-6 rounded-xl bg-[var(--color-surface-container-low)]/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <label className="block font-[family-name:var(--font-label)] text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
                      Cumulative GPA
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 3.92"
                      value={gpaValue}
                      onChange={(e) => setGpaValue(e.target.value)}
                      className="w-32 bg-[var(--color-surface-container-lowest)] border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-[var(--color-primary)]/20 text-[var(--color-on-surface)] font-[family-name:var(--font-headline)] font-bold"
                    />
                  </div>
                  <div className="flex items-center p-1 bg-[var(--color-surface-container-highest)] rounded-lg">
                    <button
                      type="button"
                      onClick={() => setGpaType("weighted")}
                      className={`px-6 py-2 rounded-md font-[family-name:var(--font-label)] text-xs font-bold transition-colors ${
                        gpaType === "weighted"
                          ? "bg-[var(--color-surface-container-lowest)] text-[var(--color-primary)] shadow-sm"
                          : "text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-lowest)]/50"
                      }`}
                    >
                      WEIGHTED
                    </button>
                    <button
                      type="button"
                      onClick={() => setGpaType("unweighted")}
                      className={`px-6 py-2 rounded-md font-[family-name:var(--font-label)] text-xs font-medium transition-colors ${
                        gpaType === "unweighted"
                          ? "bg-[var(--color-surface-container-lowest)] text-[var(--color-primary)] shadow-sm"
                          : "text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-lowest)]/50"
                      }`}
                    >
                      UNWEIGHTED
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Standardized Testing */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-[var(--color-primary)]">
                  history_edu
                </span>
                <h2 className="font-[family-name:var(--font-headline)] font-bold text-lg">
                  Standardized Testing
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* SAT */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-[var(--color-outline-variant)]/20 pb-2">
                    <span className="font-[family-name:var(--font-label)] text-sm font-bold tracking-tight">
                      SAT Score
                    </span>
                    <span className="font-[family-name:var(--font-headline)] font-bold text-[var(--color-primary)]">
                      / 1600
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-[family-name:var(--font-label)] text-[10px] text-[var(--color-on-surface-variant)] uppercase mb-1">
                        EBRW
                      </label>
                      <input
                        type="text"
                        placeholder="720"
                        value={satEbrw}
                        onChange={(e) => setSatEbrw(e.target.value)}
                        className="w-full bg-[var(--color-surface-container-low)] border-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--color-primary)]/20 text-[var(--color-on-surface)] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-[family-name:var(--font-label)] text-[10px] text-[var(--color-on-surface-variant)] uppercase mb-1">
                        Math
                      </label>
                      <input
                        type="text"
                        placeholder="780"
                        value={satMath}
                        onChange={(e) => setSatMath(e.target.value)}
                        className="w-full bg-[var(--color-surface-container-low)] border-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--color-primary)]/20 text-[var(--color-on-surface)] text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* ACT */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-[var(--color-outline-variant)]/20 pb-2">
                    <span className="font-[family-name:var(--font-label)] text-sm font-bold tracking-tight">
                      ACT Composite
                    </span>
                    <span className="font-[family-name:var(--font-headline)] font-bold text-[var(--color-primary)]">
                      / 36
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: "Eng", value: actEnglish, set: setActEnglish, ph: "34" },
                      { label: "Math", value: actMath, set: setActMath, ph: "35" },
                      { label: "Read", value: actReading, set: setActReading, ph: "32" },
                      { label: "Sci", value: actScience, set: setActScience, ph: "33" },
                    ].map((sub) => (
                      <div key={sub.label}>
                        <label className="block font-[family-name:var(--font-label)] text-[10px] text-[var(--color-on-surface-variant)] uppercase mb-1">
                          {sub.label}
                        </label>
                        <input
                          type="text"
                          placeholder={sub.ph}
                          value={sub.value}
                          onChange={(e) => sub.set(e.target.value)}
                          className="w-full bg-[var(--color-surface-container-low)] border-none rounded-lg px-2 py-2 focus:ring-2 focus:ring-[var(--color-primary)]/20 text-[var(--color-on-surface)] text-sm text-center"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Curriculum Rigor */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-[var(--color-primary)]">
                  verified
                </span>
                <h2 className="font-[family-name:var(--font-headline)] font-bold text-lg">
                  Curriculum Rigor (AP / IB)
                </h2>
              </div>
              <label className="block font-[family-name:var(--font-label)] text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-3">
                Select completed or in-progress courses
              </label>
              <div className="flex flex-wrap gap-2">
                {courseOptions.map((course) => (
                  <PillSelect
                    key={course}
                    label={course}
                    selected={selectedCourses.includes(course)}
                    onToggle={() => toggleCourse(course)}
                    showClose={selectedCourses.includes(course)}
                  />
                ))}
              </div>
            </section>

            {/* Actions */}
            <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <SecondaryButton
                onClick={() => router.push("/onboarding/personal-profile")}
                className="flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Back
              </SecondaryButton>
              <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                <span className="text-xs text-[var(--color-outline)] font-medium italic">
                  All data is encrypted and institutional-grade.
                </span>
                <PrimaryButton
                  onClick={handleContinue}
                  className="w-full md:w-auto px-12 py-4"
                >
                  Save &amp; Continue
                </PrimaryButton>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
