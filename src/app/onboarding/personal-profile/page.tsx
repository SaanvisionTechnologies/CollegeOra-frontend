"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { useAutoSave } from "@/lib/hooks/use-auto-save";
import SaveIndicator from "@/components/save-indicator";
import OnboardingHeader from "@/components/onboarding-header";
import ProgressBar from "@/components/progress-bar";
import FormInput from "@/components/form-input";
import FormTextarea from "@/components/form-textarea";
import PrimaryButton from "@/components/primary-button";
import SecondaryButton from "@/components/secondary-button";

export default function PersonalProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();

  const fullName =
    user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? "";
  const nameParts = fullName.trim().split(/\s+/);
  const defaultFirst = nameParts[0] ?? "";
  const defaultLast =
    nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

  const [firstName, setFirstName] = useState(defaultFirst);
  const [lastName, setLastName] = useState(defaultLast);
  const [dob, setDob] = useState("");
  const [phoneCode, setPhoneCode] = useState("+1");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [loaded, setLoaded] = useState(false);

  // Load existing data on mount
  useEffect(() => {
    if (!user) return;
    supabase
      .from("users")
      .select(
        "first_name, last_name, date_of_birth, phone_country_code, phone_number, city, bio"
      )
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setFirstName(data.first_name ?? defaultFirst);
          setLastName(data.last_name ?? defaultLast);
          setDob(data.date_of_birth ?? "");
          setPhoneCode(data.phone_country_code ?? "+1");
          setPhone(data.phone_number ?? "");
          setCity(data.city ?? "");
          setBio(data.bio ?? "");
        }
        setLoaded(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Auto-save
  const saveFn = useCallback(async () => {
    if (!user || !loaded) return;
    await supabase
      .from("users")
      .update({
        first_name: firstName || null,
        last_name: lastName || null,
        date_of_birth: dob || null,
        phone_country_code: phoneCode || null,
        phone_number: phone || null,
        city: city || null,
        bio: bio || null,
      })
      .eq("id", user.id);
  }, [user, loaded, firstName, lastName, dob, phoneCode, phone, city, bio, supabase]);

  const saveStatus = useAutoSave(saveFn, [
    firstName, lastName, dob, phoneCode, phone, city, bio,
  ]);

  // Continue — advance step
  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await supabase
      .from("users")
      .update({ onboarding_step: 3 })
      .eq("id", user.id);
    router.push("/onboarding/academic-profile");
  };

  return (
    <>
      <OnboardingHeader stepLabel="Step 02 — Personal Identity" />

      <main className="max-w-4xl mx-auto px-6 pt-8 pb-24">
        {/* Progress */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-3">
            <h1 className="text-4xl font-[family-name:var(--font-headline)] font-bold tracking-tight text-[var(--color-on-surface)]">
              Personal Profile
            </h1>
            <SaveIndicator status={saveStatus} />
          </div>
          <ProgressBar current={2} total={5} label="Personal Profile" />
        </div>

        {/* Grid: Sidebar + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8 hidden lg:block">
            <div className="bg-[var(--color-surface-container-low)] p-8 rounded-xl space-y-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-tertiary-fixed)] flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-[var(--color-on-tertiary-fixed-variant)]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified_user
                </span>
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-headline)] font-bold text-lg leading-tight mb-2">
                  Institutional Trust
                </h3>
                <p className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed">
                  Your identity data is encrypted and used solely for university
                  matching and application verification. We follow rigorous
                  academic privacy standards.
                </p>
              </div>
            </div>

            <div>
              <p className="font-[family-name:var(--font-label)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]/40 mb-4">
                Profile Quality Tip
              </p>
              <p className="text-sm italic text-[var(--color-on-surface-variant)]/70 leading-relaxed border-l-2 border-[var(--color-outline-variant)]/20 pl-4">
                &ldquo;A clear profile photo and a concise bio help admissions
                officers connect a story to your academic metrics.&rdquo;
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            className="lg:col-span-8 space-y-10"
            onSubmit={handleContinue}
          >
            {/* Profile Photo */}
            <section className="space-y-4">
              <label className="font-[family-name:var(--font-label)] text-sm font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">
                Profile Representation
              </label>
              <div className="flex items-center gap-8 p-6 bg-[var(--color-surface-container-lowest)] rounded-xl shadow-sm border border-[var(--color-outline-variant)]/10">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-[var(--color-surface-container-highest)] overflow-hidden border-2 border-[var(--color-surface-bright)] flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-[var(--color-on-surface-variant)]/30">
                      person
                    </span>
                  </div>
                  <button
                    type="button"
                    className="absolute -bottom-1 -right-1 bg-[var(--color-primary)] text-[var(--color-on-primary)] p-2 rounded-full shadow-lg hover:scale-105 transition-transform"
                  >
                    <span className="material-symbols-outlined text-sm">
                      edit
                    </span>
                  </button>
                </div>
                <div className="flex-1">
                  <h4 className="font-[family-name:var(--font-headline)] font-bold text-base mb-1">
                    Upload Photo
                  </h4>
                  <p className="text-xs text-[var(--color-on-surface-variant)] mb-3">
                    PNG, JPG up to 5MB. 1:1 ratio recommended.
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="px-4 py-2 bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] text-xs font-semibold rounded-lg hover:bg-[var(--color-surface-variant)] transition-colors"
                    >
                      Choose File
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 border border-[var(--color-outline-variant)]/30 text-[var(--color-on-surface)] text-xs font-semibold rounded-lg hover:bg-[var(--color-surface-container-low)] transition-colors"
                    >
                      Crop Tool
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Basic Info Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="First Name"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <FormInput
                label="Last Name"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <FormInput
                label="Date of Birth"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-widest font-[family-name:var(--font-label)] text-[var(--color-on-surface-variant)]">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <select
                    value={phoneCode}
                    onChange={(e) => setPhoneCode(e.target.value)}
                    className="w-24 bg-[var(--color-surface-container-highest)] border-none rounded-xl px-2 py-3 text-[var(--color-on-surface)] text-sm focus:ring-2 focus:ring-[var(--color-primary)]/20"
                  >
                    <option>+1</option>
                    <option>+44</option>
                    <option>+91</option>
                    <option>+61</option>
                  </select>
                  <input
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 bg-[var(--color-surface-container-highest)] border-none rounded-xl px-4 py-3 text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
                  />
                </div>
              </div>
            </section>

            {/* Location + Bio */}
            <section className="space-y-6">
              <FormInput
                label="City / Current Location"
                icon="location_on"
                placeholder="Search for your city..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <FormTextarea
                label="Short Bio"
                placeholder="Briefly describe your academic interests and extracurricular passions..."
                maxLength={250}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </section>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-[var(--color-outline-variant)]/10">
              <SecondaryButton
                onClick={() => router.push("/onboarding/welcome")}
                className="flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">
                  arrow_back
                </span>
                Back
              </SecondaryButton>
              <PrimaryButton type="submit">Continue to Step 3</PrimaryButton>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
