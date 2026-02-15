"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github, ArrowRight, GitCommit, GitPullRequest, Activity, Sparkles } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const stats = [
  { value: "10M+", label: "Commits Analyzed" },
  { value: "500K+", label: "PRs Tracked" },
  { value: "12K+", label: "Developers" },
  { value: "99.9%", label: "Uptime" },
]

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [dashboardRef, dashboardVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 })

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Animated background grid */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--muted))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        <div className="absolute top-0 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px] dark:bg-primary/20 animate-pulse-glow" />
        <div className="absolute top-40 left-20 h-32 w-32 rounded-full bg-primary/5 blur-2xl animate-float-slow" />
        <div className="absolute top-60 right-20 h-24 w-24 rounded-full bg-emerald-500/5 blur-2xl animate-float" />
        <div className="absolute bottom-40 left-1/4 h-40 w-40 rounded-full bg-primary/5 blur-3xl animate-float-fast" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div
            className={`mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 shadow-sm backdrop-blur-sm transition-all duration-700 hover-lift ${mounted ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}`}
          >
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-foreground">Open Source & Free Forever</span>
          </div>

          {/* Main headline */}
          <h1
            className={`text-balance text-4xl font-bold tracking-tight text-foreground transition-all duration-700 delay-100 sm:text-5xl md:text-6xl lg:text-7xl ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          >
            Your Engineering
            <br />
            <span className="bg-gradient-to-r from-primary via-emerald-400 to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-shift">
              Productivity Dashboard
            </span>
          </h1>

          <p
            className={`mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground transition-all duration-700 delay-200 md:text-xl ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          >
            Track commits, analyze repos, visualize language heatmaps, and monitor PR activity. Get data-driven
            visibility into your full development lifecycle.
          </p>

          {/* CTA Buttons */}
          <div
            className={`mt-10 flex flex-col items-center justify-center gap-4 transition-all duration-700 delay-300 sm:flex-row ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          >
            <Button
              asChild
              size="lg"
              className="group h-13 gap-2 rounded-xl bg-foreground px-8 text-base font-semibold text-background shadow-lg transition-all hover:scale-105 hover:bg-foreground/90 hover:shadow-xl hover-glow"
            >
              <Link href="/signin">
                <Github className="h-5 w-5" />
                Sign in with GitHub
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-13 gap-2 rounded-xl border-border bg-background/50 px-8 text-base font-semibold backdrop-blur-sm transition-all hover:bg-accent hover-lift"
            >
              See how it works
            </Button>
          </div>

          {/* Quick stats inline */}
          <div
            className={`mt-14 flex flex-wrap items-center justify-center gap-6 transition-all duration-700 delay-400 md:gap-10 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="text-center group hover-scale cursor-default"
                style={{ animationDelay: `${i * 100 + 500}ms` }}
              >
                <div className="text-2xl font-bold text-foreground md:text-3xl group-hover:text-primary transition-colors">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard Preview */}
        <div
          ref={dashboardRef}
          className={`mt-16 md:mt-20 transition-all duration-1000 ${dashboardVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
        >
          <div className="relative mx-auto max-w-5xl">
            {/* Glow effect behind dashboard */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-emerald-500/20 blur-2xl animate-pulse-glow" />

            {/* Dashboard mockup */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl hover-lift">
              {/* Window chrome */}
              <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer" />
                  </div>
                  <div className="ml-4 flex items-center gap-2 rounded-md bg-background/50 px-3 py-1">
                    <Activity className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">app.devmetrics.io/dashboard</span>
                  </div>
                </div>
              </div>

              {/* Dashboard content */}
              <div className="bg-background p-4 md:p-6">
                <div className="grid gap-4 md:grid-cols-4">
                  {/* Stat cards */}
                  {[
                    {
                      label: "Total Commits",
                      value: "2,847",
                      change: "+12.5%",
                      icon: GitCommit,
                      color: "text-emerald-500",
                    },
                    {
                      label: "Pull Requests",
                      value: "156",
                      change: "+8.2%",
                      icon: GitPullRequest,
                      color: "text-blue-500",
                    },
                    { label: "Cycle Time", value: "1.2d", change: "-18%", icon: Activity, color: "text-violet-500" },
                    { label: "Deploy Freq", value: "4.2/d", change: "+23%", icon: Sparkles, color: "text-amber-500" },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className={`group rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md hover-lift ${dashboardVisible ? "animate-slide-up" : "opacity-0"}`}
                      style={{ animationDelay: `${i * 100 + 200}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
                        <stat.icon className={`h-4 w-4 ${stat.color} group-hover:animate-bounce-subtle`} />
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                        <span
                          className={`text-xs font-medium ${stat.change.startsWith("+") ? "text-emerald-500" : "text-blue-500"}`}
                        >
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart area */}
                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                  <div
                    className={`lg:col-span-2 rounded-xl border border-border bg-card p-4 ${dashboardVisible ? "animate-slide-up stagger-6" : "opacity-0"}`}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">Commit Activity</span>
                      <span className="text-xs text-muted-foreground">Last 30 days</span>
                    </div>
                    <div className="flex h-36 items-end gap-[3px]">
                      {[
                        35, 55, 40, 70, 45, 80, 60, 90, 55, 75, 85, 65, 95, 70, 80, 50, 85, 75, 90, 60, 70, 85, 55, 65,
                        75, 88, 72, 95, 68, 82,
                      ].map((height, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-t-sm bg-primary/60 transition-all hover:bg-primary origin-bottom ${dashboardVisible ? "animate-bar-grow" : "scale-y-0"}`}
                          style={{ height: `${height}%`, animationDelay: `${i * 30 + 600}ms` }}
                        />
                      ))}
                    </div>
                  </div>

                  <div
                    className={`rounded-xl border border-border bg-card p-4 ${dashboardVisible ? "animate-slide-up stagger-7" : "opacity-0"}`}
                  >
                    <div className="mb-4 text-sm font-semibold text-foreground">Top Languages</div>
                    <div className="space-y-3">
                      {[
                        { name: "TypeScript", percent: 45, color: "bg-blue-500" },
                        { name: "Python", percent: 28, color: "bg-yellow-500" },
                        { name: "Go", percent: 15, color: "bg-cyan-500" },
                        { name: "Rust", percent: 12, color: "bg-orange-500" },
                      ].map((lang, i) => (
                        <div key={i} className="group">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                              {lang.name}
                            </span>
                            <span className="font-semibold text-foreground">{lang.percent}%</span>
                          </div>
                          <div className="mt-1 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full ${lang.color} transition-all origin-left ${dashboardVisible ? "animate-progress-fill" : "w-0"}`}
                              style={{
                                animationDelay: `${i * 150 + 800}ms`,
                                width: dashboardVisible ? `${lang.percent}%` : "0%",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}