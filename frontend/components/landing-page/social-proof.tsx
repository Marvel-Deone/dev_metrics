"use client"

import { Star, Quote, ArrowUpRight } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const testimonials = [
  {
    quote:
      "DevMetrics helped us identify bottlenecks we didn't even know existed. Our cycle time dropped by 40% in just two months.",
    author: "Sarah Chen",
    role: "Engineering Manager",
    company: "Vercel",
    avatar: "/professional-asian-woman.png",
  },
  {
    quote:
      "Finally, a tool that gives me visibility into team productivity without micromanaging. The language heatmap is incredibly useful for planning.",
    author: "Marcus Johnson",
    role: "CTO",
    company: "Linear",
    avatar: "/professional-black-man.png",
  },
  {
    quote:
      "We use the PR activity dashboard in every sprint retro. It's become essential for our continuous improvement process.",
    author: "Emily Rodriguez",
    role: "Tech Lead",
    company: "Stripe",
    avatar: "/professional-woman-latina-developer.jpg",
  },
]

const stats = [
  { value: "12,000+", label: "Developers" },
  { value: "500+", label: "Teams" },
  { value: "2M+", label: "Repos Analyzed" },
  { value: "4.9", label: "Rating", hasStars: true },
]

const companies = ["Vercel", "Stripe", "Linear", "Notion", "Figma", "GitHub"]

export function SocialProof() {
  const [statsRef, statsVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 })
  const [headerRef, headerVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 })
  const [testimonialsRef, testimonialsVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 })
  const [companiesRef, companiesVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 })

  return (
    <section id="testimonials" className="border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div ref={statsRef} className="mb-20 grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`text-center transition-all duration-700 ${statsVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl font-bold text-foreground md:text-5xl">{stat.value}</span>
                {stat.hasStars && <Star className="h-6 w-6 fill-amber-400 text-amber-400 animate-pulse" />}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Section header */}
        <div
          ref={headerRef}
          className={`mx-auto max-w-3xl text-center transition-all duration-700 ${headerVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Testimonials</span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Loved by engineering teams worldwide
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See what developers and engineering leaders are saying about DevMetrics.
          </p>
        </div>

        {/* Testimonials */}
        <div ref={testimonialsRef} className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover-lift ${testimonialsVisible ? "animate-slide-up" : "opacity-0"}`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <Quote className="h-10 w-10 text-primary/20 transition-transform group-hover:scale-110" />
              <p className="mt-4 text-foreground leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="mt-6 flex items-center gap-4">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.author}
                  className="h-12 w-12 rounded-full bg-muted object-cover ring-2 ring-transparent transition-all group-hover:ring-primary/50"
                />
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
              <ArrowUpRight className="absolute top-6 right-6 h-5 w-5 text-muted-foreground/50 transition-all group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
          ))}
        </div>

        {/* Company logos */}
        <div
          ref={companiesRef}
          className={`mt-20 transition-all duration-700 ${companiesVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          <p className="mb-8 text-center text-sm font-medium text-muted-foreground">Trusted by teams at</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {companies.map((company, i) => (
              <span
                key={company}
                className="text-xl font-semibold text-muted-foreground/60 transition-all hover:text-foreground hover:scale-110 cursor-default"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}