"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") return;

    if (!session?.onboardingCompleted) {
      router.replace("/onboarding");
    } else {
      router.replace("/dashboard");
    }
  }, [status, session, router]);

  return <div>Redirecting...</div>;
}
