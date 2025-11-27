'use client';

import { useSession } from "next-auth/react";
import { redirect, useRouter } from 'next/navigation';
import { DashboardHeader } from "@/components/dashboard-header";
import { ProfileCard } from "@/components/profile-card";
import { StatsCards } from "@/components/stats-cards";
import { CommitsChart } from "@/components/commits-chart";
import { LanguagesChart } from "@/components/languages-chart";
import { TopRepositories } from "@/components/top-repositories";
import { Skeleton } from "@/components/ui/skeleton";
import { useGitHubData } from "@/hooks/use-github-data";
import { useEffect } from "react";
import { Heatmap } from "@/components/heatmap";
import { RepositoryRanking } from "@/components/repository-rankings";

const DashboardPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter()

    const { userData, repos, loading, error } = useGitHubData(session?.user?.login);

    useEffect(() => {
        if (status === "authenticated") {
            const hasOnboarded = localStorage.getItem("devmetrics_onboarded");
            if (!hasOnboarded) {
                router.push("/onboarding");
            }
        }
    }, [status, router]);

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-background">
                <DashboardHeader />
                <div className="container mx-auto px-4 py-8">
                    <div className="space-y-6">
                        <Skeleton className="h-32 w-full rounded-lg" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-24 w-full rounded-lg" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (status === "unauthenticated") {
        redirect("/auth/signin")
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Error Loading Data</h1>
                    <p className="text-muted-foreground">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-background via-background to-secondary/5">
            <DashboardHeader />

            <div className="container mx-auto px-4 py-8">
                <div className="space-y-8">
                    {/* Profile Section */}
                    {userData && <ProfileCard user={userData} />}

                    {/* Stats Cards */}
                    <StatsCards repos={repos} />

                    {/* Heatmap Section */}
                    <Heatmap />

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {repos && repos.length > 0 && (
                            <>
                                <CommitsChart repos={repos} />
                                <LanguagesChart repos={repos} />
                            </>
                        )}
                    </div>

                    {/* Repository Ranking */}
                    {repos && repos.length > 0 && <RepositoryRanking repos={repos} />}

                    {/* Top Repositories */}
                    {repos && repos.length > 0 && <TopRepositories repos={repos} />}
                </div>
            </div>
        </div>
    )
}

export default DashboardPage;