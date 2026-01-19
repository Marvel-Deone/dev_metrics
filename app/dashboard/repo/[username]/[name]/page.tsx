"use client";

import { useCallback } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import {
    ArrowLeft,
    Star,
    GitFork,
    ExternalLink,
    Calendar,
    GitCommit,
    GitPullRequest,
    AlertCircle,
    Users,
    Lock,
    Globe,
    Archive,
    Ban,
    Copy,
    Link as LinkIcon,
    HardDrive,
    Shield,
    CheckCircle2,
    XCircle,
} from "lucide-react";

import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

import { useRepoDetails, useRepoTimeline } from "@/hooks/use-repo-details";

function PageShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader />
            <main className="container mx-auto px-4 py-8 space-y-8">{children}</main>
        </div>
    );
}

function LoadingState() {
    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader />
            <div className="container mx-auto px-4 py-8 space-y-6">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-64 w-full" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </div>
            </div>
        </div>
    );
}

function ErrorState({
    title,
    message,
    onBack,
}: {
    title: string;
    message?: string | null;
    onBack: () => void;
}) {
    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader />
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold">{title}</h1>
                {message ? <p className="mt-2 text-muted-foreground">{message}</p> : null}
                <Button onClick={onBack} className="mt-4">
                    Go Back
                </Button>
            </div>
        </div>
    );
}

const StatCard = ({
    icon,
    value,
    label,
}: {
    icon: React.ReactNode;
    value: React.ReactNode;
    label: string;
}) => (
    <Card className="bg-card/50">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            {icon}
            <span className="text-2xl font-bold">{value}</span>
            <span className="text-sm text-muted-foreground">{label}</span>
        </CardContent>
    </Card>
);

function formatDate(iso?: string) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString();
}

function formatBytesFromKb(kb?: number) {
    if (typeof kb !== "number" || !Number.isFinite(kb)) return "—";
    const bytes = kb * 1024;
    const units = ["B", "KB", "MB", "GB", "TB"];
    let val = bytes;
    let i = 0;
    while (val >= 1024 && i < units.length - 1) {
        val /= 1024;
        i += 1;
    }
    const digits = i <= 1 ? 0 : 1;
    return `${val.toFixed(digits)} ${units[i]}`;
}

export default function RepoDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { data: session, status } = useSession();

    const owner = (params.username as string) ?? "";
    const repoName = (params.name as string) ?? "";
    const token = session?.githubToken ?? "";

    const copyToClipboard = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            // no-op (swap for a toast if you have one)
        }
    }, []);

    // Session gating
    if (status === "loading") return <LoadingState />;

    if (status === "unauthenticated") {
        return (
            <ErrorState
                title="Please sign in"
                message="You need to be authenticated to view repository details."
                onBack={() => router.back()}
            />
        );
    }

    if (!owner || !repoName) {
        return (
            <ErrorState
                title="Invalid route"
                message="Missing repository owner or name in the URL."
                onBack={() => router.back()}
            />
        );
    }

    const { repoDetails, loading, error } = useRepoDetails(owner, repoName, token);
    const {
        timeline,
        loading: timelineLoading,
        error: timelineError,
    } = useRepoTimeline(owner, repoName, token);

    const timelineData = timeline ?? [];

    if (loading) return <LoadingState />;

    if (!repoDetails || error) {
        return (
            <ErrorState
                title="Failed to load repository"
                message={error || "Repository not found or you don’t have access."}
                onBack={() => router.back()}
            />
        );
    }

    const visibilityLabel = repoDetails.private ? "Private" : "Public";
    const description = repoDetails.description?.trim() || "No description provided.";

    const hasHomepage = Boolean(repoDetails.homepage);
    const topics: string[] = Array.isArray(repoDetails.topics) ? repoDetails.topics : [];

    const perms = repoDetails.permissions || {};
    const permBadges: Array<{ key: string; label: string }> = [
        { key: "admin", label: "Admin" },
        { key: "maintain", label: "Maintain" },
        { key: "push", label: "Push" },
        { key: "triage", label: "Triage" },
        { key: "pull", label: "Pull" },
    ];

    return (
        <PageShell>
            {/* Header */}
            <div className="flex flex-col gap-4">
                <Button
                    variant="ghost"
                    className="w-fit pl-0 hover:pl-2 transition-all hover:bg-accent hover:text-accent-foreground"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-3">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight">{repoDetails.name}</h1>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                <Badge variant="secondary" className="gap-1">
                                    {repoDetails.private ? (
                                        <Lock className="h-3.5 w-3.5" />
                                    ) : (
                                        <Globe className="h-3.5 w-3.5" />
                                    )}
                                    {visibilityLabel}
                                </Badge>

                                {repoDetails.fork ? <Badge variant="outline">Fork</Badge> : null}

                                {repoDetails.archived ? (
                                    <Badge variant="outline" className="gap-1">
                                        <Archive className="h-3.5 w-3.5" />
                                        Archived
                                    </Badge>
                                ) : null}

                                {repoDetails.disabled ? (
                                    <Badge variant="destructive" className="gap-1">
                                        <Ban className="h-3.5 w-3.5" />
                                        Disabled
                                    </Badge>
                                ) : null}
                            </div>
                        </div>

                        <p className="text-muted-foreground text-lg max-w-2xl">{description}</p>

                        {/* Owner */}
                        <div className="flex items-center gap-3">
                            <img
                                src={repoDetails.owner?.avatar_url}
                                alt={repoDetails.owner?.login}
                                className="h-9 w-9 rounded-full"
                            />
                            <div className="text-sm">
                                <div className="text-muted-foreground">Owner</div>
                                <a
                                    href={repoDetails.owner?.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium hover:underline"
                                >
                                    {repoDetails.owner?.login}
                                </a>
                            </div>
                        </div>

                        {/* Topics */}
                        {topics.length ? (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {topics.map((t) => (
                                    <Badge key={t} variant="outline">
                                        {t}
                                    </Badge>
                                ))}
                            </div>
                        ) : null}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button asChild className="gap-2">
                            <a href={repoDetails.html_url} target="_blank" rel="noopener noreferrer">
                                View on GitHub <ExternalLink className="w-4 h-4" />
                            </a>
                        </Button>

                        {hasHomepage ? (
                            <Button asChild variant="outline" className="gap-2 hover:text-accent-foreground">
                                <a href={repoDetails.homepage} target="_blank" rel="noopener noreferrer">
                                    Website <LinkIcon className="w-4 h-4" />
                                </a>
                            </Button>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    icon={<Star className="w-8 h-8 text-yellow-500 mb-2" />}
                    value={repoDetails.stargazers_count}
                    label="Stars"
                />
                <StatCard
                    icon={<GitFork className="w-8 h-8 text-blue-500 mb-2" />}
                    value={repoDetails.forks_count}
                    label="Forks"
                />
                <StatCard
                    icon={<AlertCircle className="w-8 h-8 text-red-500 mb-2" />}
                    value={repoDetails.open_issues_count}
                    label="Open Issues"
                />
                <StatCard
                    icon={<HardDrive className="w-8 h-8 text-muted-foreground mb-2" />}
                    value={formatBytesFromKb(repoDetails.size)}
                    label="Size"
                />
            </div>

            {/* Main */}
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">
                {/* Left column */}
                <div className="space-y-6">
                    {/* Activity Timeline */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-col md:flex-row justify-between gap-4">
                            <div>
                                <CardTitle className="mb-1">Activity Timeline</CardTitle>
                                <CardDescription>Commits and Pull Requests over the last 6 months</CardDescription>

                            </div>
                            {/* Legend */}
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                                    <span>Commits</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* pick whatever your PR bar color is */}
                                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                                    <span>PRs</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {timelineLoading ? (
                                <Skeleton className="h-[320px] w-full" />
                            ) : timelineError ? (
                                <p className="text-sm text-muted-foreground">Failed to load timeline.</p>
                            ) : (
                                <ChartContainer
                                    config={{
                                        commits: { label: "Commits", color: "var(--primary)" },
                                        prs: { label: "PRs", color: "var(--secondary)" },
                                    }}
                                    className="h-[320px] xl:h-[420px] w-full"
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={timelineData}>
                                            <CartesianGrid
                                                stroke="var(--border)"
                                                strokeDasharray="3 3"
                                                vertical={false}
                                            />
                                            <XAxis
                                                dataKey="month"
                                                tickLine={false}
                                                axisLine={false}
                                                stroke="var(--muted-foreground)"
                                            />
                                            <YAxis
                                                tickLine={false}
                                                axisLine={false}
                                                stroke="var(--muted-foreground)"
                                            />
                                            <Tooltip
                                                content={({ active, payload, label }) => {
                                                    if (!active || !payload?.length) return null;

                                                    const commits = payload.find((p) => p.dataKey === "commits")?.value ?? 0;
                                                    const prs = payload.find((p) => p.dataKey === "prs")?.value ?? 0;

                                                    return (
                                                        <div className="rounded-lg border bg-background px-3 py-2 text-sm shadow-sm">
                                                            <div className="font-medium">Commits: {commits}</div>
                                                            <div className="font-medium">PRs: {prs}</div>
                                                            {/* optional: keep month as muted */}
                                                            <div className="mt-1 text-xs text-muted-foreground">{label}</div>
                                                        </div>
                                                    );
                                                }}
                                            />
                                            <Bar
                                                dataKey="commits"
                                                fill="var(--color-commits)"
                                                radius={[4, 4, 0, 0]}
                                            />
                                            <Bar
                                                dataKey="prs"
                                                fill="#3b82f6"
                                                radius={[4, 4, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            )}
                        </CardContent>
                    </Card>

                    {/* Features */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Features</CardTitle>
                            <CardDescription>Repository capabilities</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[
                                { label: "Issues", ok: repoDetails.has_issues },
                                { label: "Projects", ok: repoDetails.has_projects },
                                { label: "Wiki", ok: repoDetails.has_wiki },
                                { label: "Pages", ok: repoDetails.has_pages },
                                { label: "Discussions", ok: repoDetails.has_discussions },
                            ].map((f) => (
                                <div key={f.label} className="flex items-center justify-between">
                                    <span className="text-muted-foreground">{f.label}</span>
                                    {f.ok ? (
                                        <span className="inline-flex items-center gap-1 font-medium">
                                            <CheckCircle2 className="h-4 w-4" /> Enabled
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                                            <XCircle className="h-4 w-4" /> Off
                                        </span>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Access */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-4 w-4" /> Access
                            </CardTitle>
                            <CardDescription>Your permission level for this repo</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {permBadges
                                .filter((p) => Boolean(perms?.[p.key]))
                                .map((p) => (
                                    <Badge key={p.key} variant="secondary">
                                        {p.label}
                                    </Badge>
                                ))}
                            {!permBadges.some((p) => Boolean(perms?.[p.key])) ? (
                                <span className="text-muted-foreground text-sm">No permission info</span>
                            ) : null}
                        </CardContent>
                    </Card>
                </div>

                {/* Right column (sticky) */}
                <div className="space-y-6 lg:sticky lg:top-24">
                    {/* Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground flex items-center gap-2">
                                    <Users className="w-4 h-4" /> Contributors
                                </span>
                                <span className="font-medium">—</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> Created
                                </span>
                                <span className="font-medium">{formatDate(repoDetails.created_at)}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground flex items-center gap-2">
                                    <GitCommit className="w-4 h-4" /> Last push
                                </span>
                                <span className="font-medium">{formatDate(repoDetails.pushed_at)}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground flex items-center gap-2">
                                    <GitPullRequest className="w-4 h-4" /> Default branch
                                </span>
                                <span className="font-medium">{repoDetails.default_branch || "—"}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> Updated
                                </span>
                                <span className="font-medium">{formatDate(repoDetails.updated_at)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Languages */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Languages</CardTitle>
                            <CardDescription>Primary language (from repo metadata)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {repoDetails.language ? (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-primary" />
                                        <span>{repoDetails.language}</span>
                                    </div>
                                    <span className="font-medium">Primary</span>
                                </div>
                            ) : (
                                <span className="text-muted-foreground">No language detected</span>
                            )}
                        </CardContent>
                    </Card>

                    {/* Links / Clone */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Links</CardTitle>
                            <CardDescription>Quick access & cloning</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-muted-foreground flex items-center gap-2">
                                    <ExternalLink className="h-4 w-4" /> GitHub
                                </span>
                                <Button asChild variant="outline" size="sm" className="hover:text-accent-foreground">
                                    <a href={repoDetails.html_url} target="_blank" rel="noopener noreferrer">
                                        Open
                                    </a>
                                </Button>
                            </div>

                            {hasHomepage ? (
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <LinkIcon className="h-4 w-4" /> Website
                                    </span>
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm"
                                        className="hover:text-accent-foreground"
                                    >
                                        <a href={repoDetails.homepage} target="_blank" rel="noopener noreferrer">
                                            Open
                                        </a>
                                    </Button>
                                </div>
                            ) : null}

                            <div className="space-y-2 pt-2">
                                <div className="text-sm font-medium flex items-center gap-2">
                                    <GitCommit className="h-4 w-4" /> Clone
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="flex-1 truncate rounded-md border px-3 py-2 text-sm text-muted-foreground">
                                        {repoDetails.clone_url || "—"}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="hover:text-accent-foreground"
                                        onClick={() => repoDetails.clone_url && copyToClipboard(repoDetails.clone_url)}
                                        aria-label="Copy HTTPS clone URL"
                                        disabled={!repoDetails.clone_url}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="flex-1 truncate rounded-md border px-3 py-2 text-sm text-muted-foreground">
                                        {repoDetails.ssh_url || "—"}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="hover:text-accent-foreground"
                                        onClick={() => repoDetails.ssh_url && copyToClipboard(repoDetails.ssh_url)}
                                        aria-label="Copy SSH clone URL"
                                        disabled={!repoDetails.ssh_url}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageShell>
    );
}
