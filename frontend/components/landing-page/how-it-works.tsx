"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Github,
  Check,
  ArrowRight,
  User,
  Mail,
  FolderGit2,
  GitCommit,
  Code2,
  GitPullRequest,
  Star,
  Loader2,
  Sparkles,
  Target,
  Users,
  TrendingUp,
  Briefcase,
} from "lucide-react"

const oauthSteps = [
  {
    id: 1,
    title: "Sign in with GitHub",
    description: "Click the button to start the OAuth flow",
  },
  {
    id: 2,
    title: "Authorize DevMetrics",
    description: "Grant read-only access to your repositories",
  },
  {
    id: 3,
    title: "Account Created",
    description: "Your profile is set up automatically",
  },
]

const onboardingSteps = [
  {
    id: 1,
    title: "Welcome",
    description: "Setting up your analytics",
    icon: Sparkles,
  },
  {
    id: 2,
    title: "Fetching Data",
    description: "Indexing your repositories",
    icon: FolderGit2,
  },
  {
    id: 3,
    title: "Choose Goals",
    description: "Personalize your experience",
    icon: Target,
  },
  {
    id: 4,
    title: "Ready!",
    description: "Dashboard is prepared",
    icon: Check,
  },
]

const goals = [
  { icon: TrendingUp, label: "Productivity tracking", selected: true },
  { icon: Briefcase, label: "Career visibility", selected: false },
  { icon: Star, label: "Portfolio enhancement", selected: true },
  { icon: Users, label: "Team collaboration", selected: false },
]

const fetchItems = [
  { icon: User, label: "User profile", done: true },
  { icon: FolderGit2, label: "Repositories", done: true },
  { icon: GitCommit, label: "Commit history (90 days)", done: true },
  { icon: Code2, label: "Languages", done: true },
  { icon: GitPullRequest, label: "PR activity", done: false },
  { icon: Star, label: "Star/fork metrics", done: false },
]

export function HowItWorks() {
  const [activePhase, setActivePhase] = useState<"oauth" | "onboarding">("oauth")
  const [oauthStep, setOauthStep] = useState(1)
  const [onboardingStep, setOnboardingStep] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [progress, setProgress] = useState(0)

  // Auto-advance animation
  useEffect(() => {
    if (!isAnimating) return

    const interval = setInterval(() => {
      if (activePhase === "oauth") {
        if (oauthStep < 3) {
          setOauthStep((prev) => prev + 1)
        } else {
          setActivePhase("onboarding")
          setOnboardingStep(1)
          setProgress(0)
        }
      } else {
        if (onboardingStep < 4) {
          setOnboardingStep((prev) => prev + 1)
          if (onboardingStep === 1) {
            setProgress(0)
          }
        } else {
          setIsAnimating(false)
          setOauthStep(1)
          setOnboardingStep(1)
          setActivePhase("oauth")
          setProgress(0)
        }
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [isAnimating, activePhase, oauthStep, onboardingStep])

  // Progress bar animation for fetching step
  useEffect(() => {
    if (activePhase === "onboarding" && onboardingStep === 2 && isAnimating) {
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev < 100 ? prev + 2 : 100))
      }, 40)
      return () => clearInterval(progressInterval)
    }
  }, [activePhase, onboardingStep, isAnimating])

  const startDemo = () => {
    setIsAnimating(true)
    setOauthStep(1)
    setOnboardingStep(1)
    setActivePhase("oauth")
    setProgress(0)
  }

  return (
    <section id="how-it-works" className="border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">How It Works</span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            From zero to insights in under 60 seconds
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            One-click GitHub authorization. Automatic data indexing. Personalized dashboard ready instantly.
          </p>
        </div>

        <div className="mt-16 grid items-start gap-12 lg:grid-cols-2">
          {/* Left side - Steps timeline */}
          <div className="space-y-8">
            {/* OAuth Phase */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="text-lg font-semibold text-foreground">GitHub OAuth Flow</h3>
              </div>

              <div className="ml-4 border-l-2 border-border pl-8 space-y-4">
                {oauthSteps.map((step, i) => (
                  <div
                    key={step.id}
                    className={`relative flex items-start gap-4 transition-all duration-500 ${
                      activePhase === "oauth" && oauthStep >= step.id ? "opacity-100" : "opacity-40"
                    }`}
                  >
                    <div
                      className={`absolute -left-[2.35rem] flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        activePhase === "oauth" && oauthStep > step.id
                          ? "border-primary bg-primary"
                          : activePhase === "oauth" && oauthStep === step.id
                            ? "border-primary bg-background"
                            : "border-border bg-background"
                      }`}
                    >
                      {activePhase === "oauth" && oauthStep > step.id && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                      {activePhase === "oauth" && oauthStep === step.id && (
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Onboarding Phase */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                    activePhase === "onboarding"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  2
                </div>
                <h3 className="text-lg font-semibold text-foreground">Onboarding Flow</h3>
              </div>

              <div className="ml-4 border-l-2 border-border pl-8 space-y-4">
                {onboardingSteps.map((step) => (
                  <div
                    key={step.id}
                    className={`relative flex items-start gap-4 transition-all duration-500 ${
                      activePhase === "onboarding" && onboardingStep >= step.id ? "opacity-100" : "opacity-40"
                    }`}
                  >
                    <div
                      className={`absolute -left-[2.35rem] flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        activePhase === "onboarding" && onboardingStep > step.id
                          ? "border-primary bg-primary"
                          : activePhase === "onboarding" && onboardingStep === step.id
                            ? "border-primary bg-background"
                            : "border-border bg-background"
                      }`}
                    >
                      {activePhase === "onboarding" && onboardingStep > step.id && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                      {activePhase === "onboarding" && onboardingStep === step.id && (
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <step.icon className="h-4 w-4 text-primary" />
                      <div>
                        <h4 className="font-medium text-foreground">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={startDemo}
              disabled={isAnimating}
              size="lg"
              className="group mt-4 h-12 gap-2 rounded-xl bg-foreground text-base font-semibold text-background transition-all hover:bg-foreground/90"
            >
              {isAnimating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Running Demo...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Watch Demo
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </div>

          {/* Right side - Interactive preview */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-emerald-500/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <div className="ml-4 flex-1 rounded-md bg-background/50 px-3 py-1 text-center">
                  <span className="text-xs text-muted-foreground">
                    {activePhase === "oauth" ? "github.com/login/oauth" : "app.devmetrics.io/onboarding"}
                  </span>
                </div>
              </div>

              {/* Content based on current step */}
              <div className="aspect-[4/3] bg-background p-6 transition-all duration-500">
                {/* OAuth Step 1 - Sign in */}
                {activePhase === "oauth" && oauthStep === 1 && (
                  <div className="flex h-full flex-col items-center justify-center text-center animate-fade-in">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-foreground shadow-lg animate-bounce-subtle">
                      <Github className="h-10 w-10 text-background" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Sign in with GitHub</h3>
                    <p className="mt-2 max-w-xs text-muted-foreground">
                      Connect your GitHub account to get started with DevMetrics
                    </p>
                    <Button className="mt-6 gap-2 rounded-xl bg-foreground text-background hover:bg-foreground/90">
                      <Github className="h-4 w-4" />
                      Continue with GitHub
                    </Button>
                  </div>
                )}

                {/* OAuth Step 2 - Authorize */}
                {activePhase === "oauth" && oauthStep === 2 && (
                  <div className="flex h-full flex-col animate-fade-in">
                    <div className="flex items-center gap-3 border-b border-border pb-4">
                      <Github className="h-8 w-8" />
                      <span className="text-lg font-semibold text-foreground">Authorize DevMetrics</span>
                    </div>

                    <div className="mt-6 space-y-4">
                      <p className="text-sm text-muted-foreground">
                        DevMetrics by <span className="font-medium text-foreground">@devmetrics</span> wants to access
                        your account
                      </p>

                      <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
                        <h4 className="text-sm font-semibold text-foreground">Permissions requested:</h4>
                        {[
                          { icon: User, label: "read:user", desc: "Read your profile data" },
                          { icon: FolderGit2, label: "repo", desc: "Access repository information" },
                          { icon: Mail, label: "user:email", desc: "Access your email address" },
                        ].map((perm, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <perm.icon className="h-4 w-4 text-primary" />
                            <div>
                              <code className="text-xs font-mono text-foreground">{perm.label}</code>
                              <p className="text-xs text-muted-foreground">{perm.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto flex gap-3">
                      <Button variant="outline" className="flex-1 rounded-xl bg-transparent">
                        Cancel
                      </Button>
                      <Button className="flex-1 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">
                        <Check className="mr-2 h-4 w-4" />
                        Authorize
                      </Button>
                    </div>
                  </div>
                )}

                {/* OAuth Step 3 - Account created */}
                {activePhase === "oauth" && oauthStep === 3 && (
                  <div className="flex h-full flex-col items-center justify-center text-center animate-fade-in">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 animate-scale-in">
                      <Check className="h-10 w-10 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Account Connected!</h3>
                    <p className="mt-2 max-w-xs text-muted-foreground">DevMetrics received your GitHub data</p>

                    <div className="mt-6 flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center text-xl font-bold text-white">
                        JD
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">johndoe</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">john@example.com</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Onboarding Step 1 - Welcome */}
                {activePhase === "onboarding" && onboardingStep === 1 && (
                  <div className="flex h-full flex-col items-center justify-center text-center animate-fade-in">
                    <div className="mb-6 relative">
                      <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Welcome to DevMetrics!</h3>
                    <p className="mt-2 max-w-xs text-muted-foreground">We are setting up your developer analytics</p>
                    <Button className="mt-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Onboarding Step 2 - Fetching data */}
                {activePhase === "onboarding" && onboardingStep === 2 && (
                  <div className="flex h-full flex-col animate-fade-in">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-foreground">Indexing Your Repositories</h3>
                      <p className="mt-1 text-sm text-muted-foreground">This usually takes a few seconds...</p>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-6 rounded-full bg-muted h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-100"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="mt-2 text-xs text-muted-foreground text-right">{progress}%</span>

                    <div className="mt-4 space-y-2 flex-1 overflow-hidden">
                      {fetchItems.map((item, i) => {
                        const isDone = i < Math.floor(progress / 16.67)
                        return (
                          <div
                            key={i}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300 ${
                              isDone ? "bg-emerald-500/10" : "bg-muted/50"
                            }`}
                          >
                            {isDone ? (
                              <Check className="h-4 w-4 text-emerald-500" />
                            ) : i === Math.floor(progress / 16.67) ? (
                              <Loader2 className="h-4 w-4 text-primary animate-spin" />
                            ) : (
                              <item.icon className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className={`text-sm ${isDone ? "text-foreground" : "text-muted-foreground"}`}>
                              {item.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Onboarding Step 3 - Choose goals */}
                {activePhase === "onboarding" && onboardingStep === 3 && (
                  <div className="flex h-full flex-col animate-fade-in">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-foreground">What are your goals?</h3>
                      <p className="mt-1 text-sm text-muted-foreground">This helps us personalize your experience</p>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3 flex-1">
                      {goals.map((goal, i) => (
                        <button
                          key={i}
                          className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                            goal.selected
                              ? "border-primary bg-primary/5 shadow-md"
                              : "border-border bg-card hover:border-primary/30"
                          }`}
                        >
                          <div className={`rounded-full p-2 ${goal.selected ? "bg-primary/10" : "bg-muted"}`}>
                            <goal.icon
                              className={`h-5 w-5 ${goal.selected ? "text-primary" : "text-muted-foreground"}`}
                            />
                          </div>
                          <span
                            className={`text-xs font-medium text-center ${
                              goal.selected ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {goal.label}
                          </span>
                          {goal.selected && (
                            <div className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                              <Check className="h-2.5 w-2.5 text-primary-foreground" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    <Button className="mt-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Onboarding Step 4 - Ready */}
                {activePhase === "onboarding" && onboardingStep === 4 && (
                  <div className="flex h-full flex-col items-center justify-center text-center animate-fade-in">
                    <div className="mb-6 relative">
                      <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 animate-scale-in">
                        <Check className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Your Dashboard is Ready!</h3>
                    <p className="mt-2 max-w-xs text-muted-foreground">
                      All your repositories have been analyzed. Start exploring your metrics.
                    </p>
                    <Button className="mt-6 gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
                      Go to Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}