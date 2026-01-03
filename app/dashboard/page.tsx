"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Activity,
    GitCommit,
    GitBranch,
    GitPullRequest,
    Code2,
    TrendingUp,
    TrendingDown,
    Calendar,
    Clock,
    Flame,
    Star,
    ExternalLink,
    Settings,
    LogOut,
    Bell,
    ChevronDown,
    BarChart3,
    RefreshCw,
    Sun,
    Moon,
    Menu,
    X,
} from "lucide-react"
import { useTheme } from "next-themes"
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Cell,
    PieChart,
    Pie,
} from "recharts"
import { useSession } from "next-auth/react"
import { useGitHubData } from "@/hooks/use-github-data"
import { DashboardHeader } from "@/components/dashboard-header"
import { useGithubMetrics } from "@/hooks/useGithubMetrics"
import { toDashboardLanguages } from "@/lib/utils/normalize-language"

// Mock data
const commitTrendsData = [
    { day: "Mon", commits: 12, additions: 450, deletions: 120 },
    { day: "Tue", commits: 19, additions: 680, deletions: 230 },
    { day: "Wed", commits: 8, additions: 220, deletions: 80 },
    { day: "Thu", commits: 24, additions: 890, deletions: 340 },
    { day: "Fri", commits: 15, additions: 520, deletions: 180 },
    { day: "Sat", commits: 6, additions: 180, deletions: 60 },
    { day: "Sun", commits: 3, additions: 90, deletions: 30 },
]

const prActivityData = [
    { week: "W1", opened: 8, merged: 6, closed: 1 },
    { week: "W2", opened: 12, merged: 10, closed: 2 },
    { week: "W3", opened: 6, merged: 8, closed: 0 },
    { week: "W4", opened: 15, merged: 12, closed: 1 },
]

const repoInsights = [
    { name: "devmetrics-app", stars: 1247, commits: 847, language: "TypeScript", trend: "+12%" },
    { name: "api-gateway", stars: 892, commits: 562, language: "Go", trend: "+8%" },
    { name: "ml-pipeline", stars: 634, commits: 423, language: "Python", trend: "+15%" },
    { name: "design-system", stars: 456, commits: 298, language: "TypeScript", trend: "+5%" },
]

const recentActivity = [
    { type: "commit", repo: "devmetrics-app", message: "feat: add dashboard analytics", time: "2 hours ago" },
    { type: "pr", repo: "api-gateway", message: "Merge: implement rate limiting", time: "4 hours ago" },
    { type: "commit", repo: "ml-pipeline", message: "fix: resolve memory leak", time: "6 hours ago" },
    { type: "pr", repo: "design-system", message: "Open: update button variants", time: "8 hours ago" },
]

const heatmapData = Array.from({ length: 52 }, (_, weekIndex) =>
    Array.from({ length: 7 }, (_, dayIndex) => ({
        week: weekIndex,
        day: dayIndex,
        value: Math.floor(Math.random() * 10),
    })),
).flat()

// Custom tooltip component for proper theming
const CustomTooltip = ({
    active,
    payload,
    label,
}: { active?: boolean; payload?: Array<{ name: string; value: number; color?: string }>; label?: string }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                {label && <p className="text-sm font-medium text-foreground mb-1">{label}</p>}
                {payload.map((entry, index) => (
                    <p key={index} className="text-sm text-muted-foreground">
                        <span className="capitalize">{entry.name}</span>:{" "}
                        <span className="font-medium text-foreground">{entry.value}</span>
                    </p>
                ))}
            </div>
        )
    }
    return null
}

// Custom pie tooltip for language chart
const CustomPieTooltip = ({
    active,
    payload,
}: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { color: string } }> }) => {
    if (active && payload && payload.length) {
        const data = payload[0]
        return (
            <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: data.payload.color }} />
                    <span className="text-sm font-medium text-foreground">{data.name}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                    Usage: <span className="font-medium text-foreground">{data.value}%</span>
                </p>
            </div>
        )
    }
    return null
}

function DashboardContent() {
    const { theme, setTheme } = useTheme()
    //   const { user, signOut } = useAuth()
    const { data: session, status } = useSession();

    const { user, repos, commitTrends, languages, pullRequests, contributionCalendar, loading, error } = useGitHubData();
    console.log('commutTrends:', commitTrends, 'contributionCalendar:', contributionCalendar);

    const username = session?.user?.login || "";
    const languageData = toDashboardLanguages(languages);
    const metrics = useGithubMetrics("Marvel-Deone");

    const [mounted, setMounted] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true)
    }, []);

    const hasFetchedRef = useRef(false);

    const handleRefresh = async () => {
        setIsRefreshing(true)
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setIsRefreshing(false)
    }

    const getHeatmapColor = (value: number) => {
        if (value === 0) return "bg-muted"
        if (value <= 2) return "bg-primary/20"
        if (value <= 4) return "bg-primary/40"
        if (value <= 6) return "bg-primary/60"
        if (value <= 8) return "bg-primary/80"
        return "bg-primary"
    }

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <DashboardHeader />

            {/* Main Content */}
            <main className="p-4 md:p-6 max-w-7xl mx-auto">
                {/* Welcome Section */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-2xl font-bold text-foreground mb-1">
                        Welcome back, {user?.name?.split(" ")[0] || "User"}
                    </h1>
                    <p className="text-muted-foreground">Here&apos;s your engineering productivity overview</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <StatsCard label="Total Commits" value={metrics.commits} change="+12%" trend="up" icon={GitCommit} delay={0} />
                    <StatsCard label="Pull Requests" value={pullRequests} change="+8%" trend="up" icon={GitPullRequest} delay={1} />
                    <StatsCard label="Code Reviews" value={metrics.reviews} change="+23%" trend="up" icon={Code2} delay={2} />
                    <StatsCard label="Current Streak" value={`${metrics?.bestStreak ?? 0} days`} change={`Best: ${metrics?.bestStreak}`} trend="neutral" icon={Flame} delay={3} />
                </div>

                {/* Main Grid */}
                <div className="grid lg:grid-cols-3 gap-6 mb-6">
                    {/* Commit Trends - Large Card */}
                    <Card className="lg:col-span-2 animate-slide-up stagger-1 border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <GitCommit className="h-5 w-5 text-primary" />
                                    Commit Trends
                                </CardTitle>
                                <CardDescription>Your commit activity this week</CardDescription>
                            </div>
                            <Badge variant="secondary" className="font-mono">
                                87 commits
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={commitTrends}>
                                        <defs>
                                            <linearGradient id="commitGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="oklch(0.65 0.2 155)" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="oklch(0.65 0.2 155)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.01 285)" opacity={0.3} />
                                        <XAxis
                                            dataKey="day"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }}
                                        />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="commits"
                                            stroke="oklch(0.65 0.2 155)"
                                            strokeWidth={2}
                                            fill="url(#commitGradient)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Language Breakdown */}
                    <Card className="animate-slide-up stagger-2 border-border/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-primary" />
                                Language Heatmap
                            </CardTitle>
                            <CardDescription>Code distribution by language</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[180px] mb-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={languageData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={75}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {languageData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomPieTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="space-y-2">
                                {languageData.map((lang) => (
                                    <div key={lang.name} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: lang.color }} />
                                            <span className="text-foreground">{lang.name}</span>
                                        </div>
                                        <span className="text-muted-foreground font-mono">{lang.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 mb-6">
                    {/* PR Activity */}
                    <Card className="animate-slide-up stagger-3 border-border/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <GitPullRequest className="h-5 w-5 text-primary" />
                                PR Activity
                            </CardTitle>
                            <CardDescription>Pull request statistics</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={prActivityData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.01 285)" opacity={0.3} />
                                        <XAxis
                                            dataKey="week"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }}
                                        />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="opened" fill="oklch(0.6 0.15 200)" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="merged" fill="oklch(0.65 0.2 155)" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-center gap-6 mt-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="h-3 w-3 rounded-full bg-chart-2" />
                                    <span className="text-muted-foreground">Opened</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="h-3 w-3 rounded-full bg-primary" />
                                    <span className="text-muted-foreground">Merged</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Repo Insights */}
                    <Card className="lg:col-span-2 animate-slide-up stagger-4 border-border/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <GitBranch className="h-5 w-5 text-primary" />
                                Repo Insights
                            </CardTitle>
                            <CardDescription>Your most active repositories</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {repoInsights.map((repo, index) => (
                                    <div
                                        key={repo.name}
                                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group cursor-pointer"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center border border-border">
                                                <GitBranch className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                                                    {repo.name}
                                                </p>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Star className="h-3 w-3" />
                                                        {repo.stars}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <GitCommit className="h-3 w-3" />
                                                        {repo.commits}
                                                    </span>
                                                    <Badge variant="outline" className="text-xs py-0">
                                                        {repo.language}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-primary font-medium">{repo.trend}</span>
                                            <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Contribution Heatmap & Recent Activity */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Contribution Heatmap */}
                    <Card className="lg:col-span-2 animate-slide-up stagger-5 border-border/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                Contribution Graph
                            </CardTitle>
                            <CardDescription>Your activity over the past year</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto pb-2">
                                <div className="flex gap-1 min-w-[800px]">
                                    {Array.from({ length: 52 }, (_, weekIndex) => (
                                        <div key={weekIndex} className="flex flex-col gap-1">
                                            {Array.from({ length: 7 }, (_, dayIndex) => {
                                                const dataPoint = heatmapData.find((d) => d.week === weekIndex && d.day === dayIndex)
                                                return (
                                                    <div
                                                        key={dayIndex}
                                                        className={`h-3 w-3 rounded-sm ${getHeatmapColor(dataPoint?.value || 0)} transition-all hover:scale-125`}
                                                        title={`${dataPoint?.value || 0} contributions`}
                                                    />
                                                )
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
                                <span>Less</span>
                                <div className="flex gap-1">
                                    <div className="h-3 w-3 rounded-sm bg-muted" />
                                    <div className="h-3 w-3 rounded-sm bg-primary/20" />
                                    <div className="h-3 w-3 rounded-sm bg-primary/40" />
                                    <div className="h-3 w-3 rounded-sm bg-primary/60" />
                                    <div className="h-3 w-3 rounded-sm bg-primary" />
                                </div>
                                <span>More</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="animate-slide-up stagger-5 border-border/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <Clock className="h-5 w-5 text-primary" />
                                Recent Activity
                            </CardTitle>
                            <CardDescription>Your latest actions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivity.map((activity, index) => (
                                    <div key={index} className="flex gap-3">
                                        <div
                                            className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${activity.type === "commit" ? "bg-primary/10" : "bg-chart-2/10"
                                                }`}
                                        >
                                            {activity.type === "commit" ? (
                                                <GitCommit className="h-4 w-4 text-primary" />
                                            ) : (
                                                <GitPullRequest className="h-4 w-4 text-chart-2" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-foreground truncate">{activity.message}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {activity.repo} · {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}

function StatsCard({
    label,
    value,
    change,
    trend,
    icon: Icon,
    delay,
}: {
    label: string
    value: string | number
    change: string
    trend: "up" | "down" | "neutral"
    icon: React.ElementType
    delay: number
}) {
    return (
        <Card className="animate-slide-up border-border/50" style={{ animationDelay: `${delay * 100}ms` }}>
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div
                        className={`flex items-center gap-1 text-xs font-medium ${trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-muted-foreground"
                            }`}
                    >
                        {trend === "up" && <TrendingUp className="h-3 w-3" />}
                        {trend === "down" && <TrendingDown className="h-3 w-3" />}
                        {change}
                    </div>
                </div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
            </CardContent>
        </Card>
    )
}

export default function DashboardPage() {
    return (
        <DashboardContent />
    )
}
