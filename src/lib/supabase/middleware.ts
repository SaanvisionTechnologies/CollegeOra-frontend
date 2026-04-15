import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isOnboarding = pathname.startsWith("/onboarding");
  const isDashboard = pathname.startsWith("/dashboard");
  const isRoot = pathname === "/";
  const isPublicAuth = ["/verify-email", "/forgot-password", "/reset-password"].includes(pathname);

  // Public auth pages — always accessible
  if (isPublicAuth) {
    return supabaseResponse;
  }

  // Unauthenticated → can only access login
  if (!user && (isOnboarding || isDashboard)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Authenticated → check onboarding status
  if (user && (isRoot || isOnboarding || isDashboard)) {
    const { data: profile } = await supabase
      .from("users")
      .select("onboarding_completed, onboarding_step")
      .eq("id", user.id)
      .single();

    const onboardingCompleted = profile?.onboarding_completed ?? false;
    const onboardingStep = profile?.onboarding_step ?? 1;

    // Completed onboarding → go to dashboard (not login or onboarding)
    if (onboardingCompleted && (isRoot || isOnboarding)) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    // Incomplete onboarding → route to correct step (not login or dashboard)
    if (!onboardingCompleted && (isRoot || isDashboard)) {
      const stepRoutes: Record<number, string> = {
        1: "/onboarding/welcome",
        2: "/onboarding/personal-profile",
        3: "/onboarding/academic-profile",
        4: "/onboarding/interests",
        5: "/onboarding/confirm",
      };
      const url = request.nextUrl.clone();
      url.pathname = stepRoutes[onboardingStep] ?? "/onboarding/welcome";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
