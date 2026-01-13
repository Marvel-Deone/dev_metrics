"use client"

import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from "recharts"

import { DashboardHeader } from "@/components/dashboard-header"
import { useGitHubData } from "@/hooks/use-github-data"
import { useGithubMetrics } from "@/hooks/useGithubMetrics"
import { toDashboardLanguages } from "@/lib/utils/normalize-language"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GitCommit, GitPullRequest, Code2, Flame, BarChart3, Calendar, Clock, Star, ExternalLink, GitBranch, TrendingUp, TrendingDown } from "lucide-react"
import { formatGitHubDate, getLastYearGrid, timeAgo } from "@/lib/utils/common.util"
import Link from "next/link"

// Types
type PRWeekActivity = { week: string; opened: number; merged: number; closed?: number }
type PRActivity = { weekly: PRWeekActivity[] }

const repoInsights = [
    { name: "devmetrics-app", stars: 1247, commits: 847, language: "TypeScript", trend: "+12%" },
    { name: "api-gateway", stars: 892, commits: 562, language: "Go", trend: "+8%" },
    { name: "ml-pipeline", stars: 634, commits: 423, language: "Python", trend: "+15%" },
    { name: "design-system", stars: 456, commits: 298, language: "TypeScript", trend: "+5%" },
]

// const recentActivity = [
//     { type: "commit", repo: "devmetrics-app", message: "feat: add dashboard analytics", time: "2 hours ago" },
//     { type: "pr", repo: "api-gateway", message: "Merge: implement rate limiting", time: "4 hours ago" },
//     { type: "commit", repo: "ml-pipeline", message: "fix: resolve memory leak", time: "6 hours ago" },
//     { type: "pr", repo: "design-system", message: "Open: update button variants", time: "8 hours ago" },
// ]

// const heatmapData = Array.from({ length: 52 }, (_, weekIndex) =>
//     Array.from({ length: 7 }, (_, dayIndex) => ({
//         week: weekIndex,
//         day: dayIndex,
//         value: Math.floor(Math.random() * 10),
//     }))
// ).flat();

// Custom Tooltips
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                {label && <p className="text-sm font-medium text-foreground mb-1">{label}</p>}
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-sm text-muted-foreground">
                        <span className="capitalize">{entry.name}</span>: <span className="font-medium text-foreground">{entry.value}</span>
                    </p>
                ))}
            </div>
        )
    }
    return null
}

const CustomPieTooltip = ({ active, payload }: any) => {
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

// Stats Card Component
function StatsCard({ label, value, change, trend, icon: Icon, delay }: any) {
    return (
        <Card className="animate-slide-up border-border/50" style={{ animationDelay: `${delay * 100}ms` }}>
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium ${trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-muted-foreground"
                        }`}>
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

// Main Dashboard
function DashboardContent() {
    const { theme, setTheme } = useTheme()
    const { data: session } = useSession()
    const { user, repos = [], activeRepos = [], commitTrends, languages, pullRequests, contributionCalendar = [], loading, error, prActivity, recentActivity } = useGitHubData() || {}
    const username = session?.user?.login || ""
    const metrics = useGithubMetrics(username || "Marvel-Deone")
    const languageData = toDashboardLanguages(languages ?? [])

    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    console.log('recentActivity:', recentActivity);


    const contributionMap = React.useMemo(() => {
        return new Map(
            contributionCalendar.map((d: any) => [d.date, d.contributionCount])
        )
    }, [contributionCalendar])

    if (!mounted) return null

    const getHeatmapColor = (count: number) => {
        if (count === 0) return "bg-muted"
        if (count < 3) return "bg-primary/20"
        if (count < 6) return "bg-primary/40"
        if (count < 10) return "bg-primary/60"
        return "bg-primary"
    }

    const weeks = getLastYearGrid()
    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader />
            <main className="p-4 md:p-6 max-w-7xl mx-auto">
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-2xl font-bold text-foreground mb-1">Welcome back, John</h1>
                    <p className="text-muted-foreground">Here's your engineering productivity overview</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <StatsCard label="Total Commits" value={metrics?.commits ?? 0} change="+12%" trend="up" icon={GitCommit} delay={0} />
                    <StatsCard label="Pull Requests" value={pullRequests ?? 0} change="+8%" trend="up" icon={GitPullRequest} delay={1} />
                    <StatsCard label="Code Reviews" value={metrics?.reviews ?? 0} change="+23%" trend="up" icon={Code2} delay={2} />
                    <StatsCard label="Current Streak" value={`${metrics?.bestStreak ?? 0} days`} change={`Best: ${metrics?.bestStreak ?? 0}`} trend="neutral" icon={Flame} delay={3} />
                </div>

                {/* Charts, Repo Insights, Heatmap, Recent Activity */}
                <div className="grid lg:grid-cols-3 gap-6 mb-6">
                    {/* Commit Trends */}
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
                                {commitTrends?.reduce((sum, c) => sum + (c.commits ?? 0), 0) ?? 0} commits
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
                                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="commits" stroke="oklch(0.65 0.2 155)" strokeWidth={2} fill="url(#commitGradient)" />
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
                                    <BarChart data={prActivity.weekly}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.01 285)" opacity={0.3} />
                                        <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }} />
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
                                    // <Link
                                    //     href={`/dashboard/repos/${repo.name}`}
                                    //     className="block"
                                    //     key={repo.name}
                                    // >
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
                                            {/* <span className="text-sm text-primary font-medium">{repo.trend}</span> */}
                                            <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                    // </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

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
                                {/* <div className="flex gap-1 min-w-[800px]">
                                    {Array.from({ length: 52 }, (_, weekIndex) => (
                                        <div key={weekIndex} className="flex flex-col gap-1">
                                            {Array.from({ length: 7 }, (_, dayIndex) => {
                                                const dataPoint = heatmapData.find((d) => d.week === weekIndex && d.day === dayIndex);
                                                return (
                                                    <div
                                                        key={dayIndex}
                                                        className={`h-3 w-3 rounded-sm ${getHeatmapColor(dataPoint?.value || 0)} transition-all hover:scale-125`}
                                                        title={`${dataPoint?.value || 0} contributions`}
                                                    />
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div> */}
                                <div className="overflow-x-auto pb-2">
                                    <div className="flex gap-1 min-w-[800px]">
                                        {weeks.map((week, wi) => (
                                            <div key={wi} className="flex flex-col gap-1">
                                                {week.map((day, di) => {
                                                    const dateKey = day.toISOString().split("T")[0]
                                                    const count = contributionMap.get(dateKey) ?? 0

                                                    return (
                                                        <div
                                                            key={di}
                                                            // title={`${count} contributions on ${dateKey}`}
                                                            title={formatGitHubDate(dateKey, count)}
                                                            className={`h-3 w-3 rounded-sm ${getHeatmapColor(count)} transition-transform hover:scale-125`}
                                                        />
                                                    )
                                                })}
                                            </div>
                                        ))}
                                    </div>
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
                                            className={`h-8 w-8 rounded-full flex items-center justify-center ${activity.type === "commit"
                                                ? "bg-primary/10"
                                                : "bg-chart-2/10"
                                                }`}
                                        >
                                            {activity.type === "commit" ? (
                                                <GitCommit className="h-4 w-4 text-primary" />
                                            ) : (
                                                <GitPullRequest className="h-4 w-4 text-chart-2" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-foreground truncate">
                                                {activity.message}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {activity.repo} · {timeAgo(activity.date)}
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

export default function DashboardPage() {
    return <DashboardContent />
}
