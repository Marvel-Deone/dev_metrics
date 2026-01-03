"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github, ArrowRight, Sparkles } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
// import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function CTASection() {
  const [ref, isVisible] = useScrollAnimation<HTMLElement>({ threshold: 0.2 })

  return (
    <section ref={ref} className="bg-muted/30 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`relative overflow-hidden rounded-3xl border border-border bg-card transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
        >
          {/* Background effects */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/10 blur-[100px] animate-pulse-glow" />
            <div
              className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-[100px] animate-pulse-glow"
              style={{ animationDelay: "1.5s" }}
            />
          </div>

          <div className="px-6 py-16 text-center md:px-12 md:py-24">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 animate-bounce-subtle">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>

            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Ready to boost your engineering productivity?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Join thousands of developers who use DevMetrics to understand their workflow, identify bottlenecks, and
              continuously improve.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group h-14 gap-2 rounded-xl bg-foreground px-10 text-base font-semibold text-background shadow-lg transition-all hover:scale-105 hover:bg-foreground/90 hover:shadow-xl hover-glow"
              >
                <Link href="/signin">
                  <Github className="h-5 w-5" />
                  Sign in with GitHub
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Free forever for individual developers • No credit card required
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}