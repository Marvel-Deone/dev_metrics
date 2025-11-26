"use client"

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ArrowLeft,
    Star,
    GitFork,
    Eye,
    ExternalLink,
    Calendar,
    GitCommit,
    GitPullRequest,
    AlertCircle,
    Users,
} from "lucide-react";
import { useGitHubData } from "@/hooks/use-github-data";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useEffect, useState } from "react";

const RepoDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [repoDetails, setRepoDetails] = useState<any>();

    //   const { repos, loading } = useGitHubData(session?.user?.name, session?.accessToken)
    const { repos, loading } = useGitHubData(session?.user?.name);
    const loginName = session?.user?.login;
    const repoName = params.name as string;

    // Fetch repo details
    useEffect(() => {
        if (!loginName || !repoName) return;

        const fetchRepoDetails = async () => {
            try {
                const res = await fetch(
                    `https://api.github.com/repos/${session?.user?.login}/${repoName}`
                );
                if (!res.ok) throw new Error("Failed to fetch repo details");

                const data = await res.json();

                setRepoDetails(data);
            } catch (err) {
                console.error(err);
            } finally {
                // setRepoDetailsLoading(false);
            }
        };

        fetchRepoDetails();
    }, [loginName, repoName]);

    const repo = repos?.find((r) => r.name === repoName);
    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <DashboardHeader />
                <div className="container mx-auto px-4 py-8 space-y-6">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-64 w-full" />
                    <div className="grid grid-cols-3 gap-4">
                        <Skeleton className="h-32" />
                        <Skeleton className="h-32" />
                        <Skeleton className="h-32" />
                    </div>
                </div>
            </div>
        )
    }

    if (!repoDetails) {
        return (
            <div className="min-h-screen bg-background">
                <DashboardHeader />
                <div className="container mx-auto px-4 py-8 text-center">
                    <h1 className="text-2xl font-bold">Repository not found</h1>
                    <Button onClick={() => router.back()} className="mt-4">
                        Go Back
                    </Button>
                </div>
            </div>
        )
    }

    // Mock timeline data
    const timelineData = [
        { month: "Jan", commits: 12, prs: 2 },
        { month: "Feb", commits: 18, prs: 4 },
        { month: "Mar", commits: 24, prs: 3 },
        { month: "Apr", commits: 15, prs: 5 },
        { month: "May", commits: 32, prs: 8 },
        { month: "Jun", commits: 28, prs: 6 },
    ]

    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader />
            <main className="container mx-auto px-4 py-8 space-y-8">
                <div className="flex flex-col gap-4">
                    <Button variant="ghost" className="w-fit pl-0 hover:pl-2 transition-all" onClick={() => router.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                    </Button>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight">{repoDetails?.name}</h1>
                            <p className="text-muted-foreground text-lg mt-2 max-w-2xl">{repoDetails?.description}</p>
                        </div>
                        <Button asChild className="gap-2">
                            <a href={repoDetails?.html_url} target="_blank" rel="noopener noreferrer">
                                View on GitHub <ExternalLink className="w-4 h-4" />
                            </a>
                        </Button>
                    </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-card/50">
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                            <Star className="w-8 h-8 text-yellow-500 mb-2" />
                            <span className="text-2xl font-bold">{repoDetails?.stargazers_count}</span>
                            <span className="text-sm text-muted-foreground">Stars</span>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50">
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                            <GitFork className="w-8 h-8 text-blue-500 mb-2" />
                            <span className="text-2xl font-bold">{repoDetails?.forks_count}</span>
                            <span className="text-sm text-muted-foreground">Forks</span>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50">
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                            <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                            <span className="text-2xl font-bold">{repoDetails?.open_issues_count}</span>
                            <span className="text-sm text-muted-foreground">Open Issues</span>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50">
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                            <Eye className="w-8 h-8 text-green-500 mb-2" />
                            <span className="text-2xl font-bold">{repoDetails?.watchers_count}</span>
                            <span className="text-sm text-muted-foreground">Watchers</span>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Commit Timeline */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Activity Timeline</CardTitle>
                            <CardDescription>Commits and Pull Requests over the last 6 months</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={{
                                    commits: { label: "Commits", color: "hsl(var(--primary))" },
                                    prs: { label: "PRs", color: "hsl(var(--secondary))" },
                                }}
                                className="h-[300px]"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={timelineData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                        <XAxis dataKey="month" tickLine={false} axisLine={false} />
                                        <YAxis tickLine={false} axisLine={false} />
                                        <Tooltip content={<ChartTooltipContent />} cursor={{ fill: "hsl(var(--muted)/0.2)" }} />
                                        <Bar dataKey="commits" fill="var(--color-commits)" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="prs" fill="var(--color-prs)" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Repo Details */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <Users className="w-4 h-4" /> Contributors
                                    </span>
                                    <span className="font-medium">12</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <Calendar className="w-4 h-4" /> Created
                                    </span>
                                    {/* <span className="font-medium">{new Date(repo.created_at).toLocaleDateString()}</span> */}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <GitCommit className="w-4 h-4" /> Last Commit
                                    </span>
                                    <span className="font-medium">{new Date(repoDetails.pushed_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <GitPullRequest className="w-4 h-4" /> Default Branch
                                    </span>
                                    <span className="font-medium">{repoDetails.default_branch}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Languages</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-2">
                                    {repoDetails.language && (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-primary" />
                                                <span>{repoDetails.language}</span>
                                            </div>
                                            <span className="font-medium">100%</span>
                                        </div>
                                    )}
                                    {!repoDetails.language && <span className="text-muted-foreground">No language detected</span>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default RepoDetailPage;