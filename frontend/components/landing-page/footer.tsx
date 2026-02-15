"use client"

import { BarChart3, Github, Twitter, Linkedin } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const footerLinks = {
  Product: ["Features", "Pricing", "Integrations", "Changelog", "Roadmap"],
  Resources: ["Documentation", "API Reference", "Blog", "Community", "Status"],
  Company: ["About", "Careers", "Contact", "Press"],
  Legal: ["Privacy", "Terms", "Security", "Cookies"],
}

export function Footer() {
  const [ref, isVisible] = useScrollAnimation<HTMLElement>({ threshold: 0.1 })

  return (
    <footer ref={ref} className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div
          className={`grid gap-8 lg:grid-cols-6 transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary transition-transform group-hover:scale-110 group-hover:rotate-3">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">DevMetrics</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground leading-relaxed">
              Your engineering productivity dashboard. Track commits, analyze repos, visualize language heatmaps, and
              monitor PR activity.
            </p>
            {/* Social links */}
            <div className="mt-6 flex gap-3">
              {[
                { icon: Github, label: "GitHub" },
                { icon: Twitter, label: "Twitter" },
                { icon: Linkedin, label: "LinkedIn" },
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary hover:scale-110"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <div
              key={category}
              className={`transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
              style={{ transitionDelay: `${(categoryIndex + 1) * 100}ms` }}
            >
              <h3 className="mb-4 text-sm font-semibold text-foreground">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-all hover:text-primary hover:translate-x-1 inline-block"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className={`mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row transition-all duration-700 delay-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} DevMetrics. All rights reserved.</p>
          <p className="text-sm text-muted-foreground">Built with Next.js • Deployed on Vercel</p>
        </div>
      </div>
    </footer>
  )
}