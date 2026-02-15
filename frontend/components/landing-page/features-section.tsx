"use client"

import { GitCommit, FolderGit2, Code2, GitPullRequest, TrendingUp, Clock, AlertTriangle, Heart } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const features = [
  {
    icon: GitCommit,
    title: "Commit Trends",
    description:
      "Visualize commit patterns over time. Identify peak productivity hours and track contribution consistency across your team.",
    color: "from-emerald-500 to-teal-500",
    preview: "commits",
  },
  {
    icon: FolderGit2,
    title: "Repo Insights",
    description:
      "Deep analytics for every repository. Understand code growth, contributor distribution, and overall project health.",
    color: "from-blue-500 to-indigo-500",
    preview: "repo",
  },
  {
    icon: Code2,
    title: "Language Heatmap",
    description:
      "See which languages dominate your codebase. Track technology adoption and skill distribution across teams.",
    color: "from-violet-500 to-purple-500",
    preview: "heatmap",
  },
  {
    icon: GitPullRequest,
    title: "PR Activity",
    description:
      "Monitor pull request velocity, review times, and merge rates. Optimize your code review workflow for faster delivery.",
    color: "from-orange-500 to-red-500",
    preview: "pr",
  },
]

const additionalFeatures = [
  {
    icon: TrendingUp,
    title: "Velocity Metrics",
    description: "Track cycle time, lead time, deployment frequency and build success rate.",
  },
  {
    icon: AlertTriangle,
    title: "Bottleneck Detection",
    description: "Automatically identify slow tasks, blocked PRs, and overloaded team members.",
  },
  {
    icon: Heart,
    title: "Team Health",
    description: "Monitor workload balance, burnout indicators, and after-hours activity.",
  },
  {
    icon: Clock,
    title: "Predictive Analytics",
    description: "Forecast completion times, sprint success probability, and potential delays.",
  },
]

function CommitPreview() {
  const weeks = 8
  const days = 7

  return (
    <div className="mt-4 rounded-xl bg-muted/50 p-4">
      <div className="flex gap-1">
        {Array.from({ length: weeks }).map((_, weekIndex) => (
          <div key={weekIndex} className="flex flex-1 flex-col gap-1">
            {Array.from({ length: days }).map((_, dayIndex) => {
              const seed = weekIndex * 7 + dayIndex
              const intensity = Math.sin(seed * 0.5) * 0.5 + 0.5
              return (
                <div
                  key={dayIndex}
                  className={`aspect-square rounded-sm transition-all hover:scale-110 ${
                    intensity > 0.75
                      ? "bg-primary"
                      : intensity > 0.5
                        ? "bg-primary/70"
                        : intensity > 0.25
                          ? "bg-primary/40"
                          : "bg-primary/10"
                  }`}
                  style={{ animationDelay: `${(weekIndex * 7 + dayIndex) * 20}ms` }}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>8 weeks ago</span>
        <span>Today</span>
      </div>
    </div>
  )
}

function RepoPreview() {
  const repos = [
    { name: "frontend", commits: 847, prs: 56, health: 94 },
    { name: "api-server", commits: 623, prs: 41, health: 88 },
    { name: "mobile-app", commits: 412, prs: 28, health: 91 },
  ]

  return (
    <div className="mt-4 space-y-2">
      {repos.map((repo, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3 transition-all hover:bg-muted/70 hover:translate-x-1"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <FolderGit2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <span className="text-sm font-medium text-foreground">{repo.name}</span>
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span>{repo.commits} commits</span>
                <span>•</span>
                <span>{repo.prs} PRs</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 animate-progress-fill"
                style={{ width: `${repo.health}%` }}
              />
            </div>
            <span className="text-xs font-medium text-emerald-500">{repo.health}%</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function HeatmapPreview() {
  const languages = [
    { name: "TypeScript", percent: 42, color: "bg-blue-500" },
    { name: "Python", percent: 28, color: "bg-yellow-500" },
    { name: "Go", percent: 18, color: "bg-cyan-500" },
    { name: "Other", percent: 12, color: "bg-muted-foreground/50" },
  ]

  return (
    <div className="mt-4 rounded-xl bg-muted/50 p-4">
      <div className="flex h-4 overflow-hidden rounded-full">
        {languages.map((lang, i) => (
          <div
            key={i}
            className={`${lang.color} transition-all first:rounded-l-full last:rounded-r-full hover:brightness-110`}
            style={{ width: `${lang.percent}%` }}
          />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {languages.map((lang, i) => (
          <div key={i} className="flex items-center gap-2 text-xs group cursor-default">
            <div className={`h-2.5 w-2.5 rounded-full ${lang.color} group-hover:scale-125 transition-transform`} />
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">{lang.name}</span>
            <span className="ml-auto font-semibold text-foreground">{lang.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PRPreview() {
  const prs = [
    { title: "feat: add auth flow", status: "merged", time: "2h", author: "SC" },
    { title: "fix: resolve caching bug", status: "open", time: "4h", author: "MJ" },
    { title: "refactor: api layer", status: "review", time: "1d", author: "ER" },
  ]

  return (
    <div className="mt-4 space-y-2">
      {prs.map((pr, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3 transition-all hover:bg-muted/70 hover:translate-x-1"
        >
          <div className="flex items-center gap-3">
            <GitPullRequest
              className={`h-4 w-4 ${pr.status === "merged" ? "text-violet-500" : pr.status === "open" ? "text-emerald-500" : "text-amber-500"}`}
            />
            <div>
              <span className="text-sm font-medium text-foreground">{pr.title}</span>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    pr.status === "merged"
                      ? "bg-violet-500/10 text-violet-500"
                      : pr.status === "open"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-amber-500/10 text-amber-500"
                  }`}
                >
                  {pr.status}
                </span>
                <span>{pr.time} ago</span>
              </div>
            </div>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
            {pr.author}
          </div>
        </div>
      ))}
    </div>
  )
}

export function FeaturesSection() {
  const [headerRef, headerVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 })
  const [cardsRef, cardsVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 })
  const [additionalRef, additionalVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 })

  return (
    <section id="features" className="border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={headerRef}
          className={`mx-auto max-w-3xl text-center transition-all duration-700 ${headerVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-primary animate-pulse">Features</span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Everything you need to understand your engineering velocity
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Four core metrics that give you complete visibility into productivity. No guesswork — just actionable
            insights.
          </p>
        </div>

        {/* Main feature cards */}
        <div ref={cardsRef} className="mt-16 grid gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-xl hover-lift ${cardsVisible ? "animate-slide-up" : "opacity-0"}`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Gradient background on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-500 group-hover:opacity-[0.03]`}
              />

              <div className="relative">
                <div className="flex items-start gap-4">
                  <div
                    className={`rounded-xl bg-gradient-to-br ${feature.color} p-3 transition-transform group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
                {feature.preview === "commits" && <CommitPreview />}
                {feature.preview === "repo" && <RepoPreview />}
                {feature.preview === "heatmap" && <HeatmapPreview />}
                {feature.preview === "pr" && <PRPreview />}
              </div>
            </div>
          ))}
        </div>

        {/* Additional features grid */}
        <div ref={additionalRef} className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {additionalFeatures.map((feature, i) => (
            <div
              key={i}
              className={`rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md hover-lift ${additionalVisible ? "animate-slide-up" : "opacity-0"}`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <feature.icon className="h-8 w-8 text-primary transition-transform hover:scale-110" />
              <h3 className="mt-3 font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}