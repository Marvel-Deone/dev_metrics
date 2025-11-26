"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { StepWelcome } from "@/components/onboarding/step-welcome";
import { StepFetch } from "@/components/onboarding/step-fetch";
import { StepGoals } from "@/components/onboarding/step-goals";
import { StepSuccess } from "@/components/onboarding/step-success";
import { DashboardHeader } from "@/components/dashboard-header";

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
        }
    }, [status, router]);

    const handleNext = () => {
        setStep((prev) => prev + 1);
    }

    const handleComplete = () => {
        localStorage.setItem("devmetrics_onboarded", "true");
        router.push("/dashboard");
    }

    if (status === "loading") return null;

    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                {step === 1 && <StepWelcome onNext={handleNext} user={session?.user} />}
                {step === 2 && <StepFetch onNext={handleNext} />}
                {step === 3 && <StepGoals onNext={handleNext} />}
                {step === 4 && <StepSuccess onComplete={handleComplete} />}
            </main>
        </div>
    )
}