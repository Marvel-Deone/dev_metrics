"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Briefcase, LineChart, Users, Trophy } from "lucide-react"

interface StepGoalsProps {
  onNext: () => void
}

const GOALS = [
  {
    id: "productivity",
    title: "Productivity Tracking",
    description: "Optimize my workflow and coding habits",
    icon: LineChart,
  },
  {
    id: "career",
    title: "Career Visibility",
    description: "Showcase my stats for job applications",
    icon: Briefcase,
  },
  {
    id: "portfolio",
    title: "Portfolio Enhancement",
    description: "Build a data-driven developer portfolio",
    icon: Trophy,
  },
  {
    id: "team",
    title: "Team Collaboration",
    description: "Improve code reviews and team contributions",
    icon: Users,
  },
]

export function StepGoals({ onNext }: StepGoalsProps) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">What is your primary goal?</CardTitle>
          <CardDescription className="text-lg">
            This helps us personalize your dashboard recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GOALS.map((goal) => {
              const Icon = goal.icon
              const isSelected = selected === goal.id
              return (
                <div
                  key={goal.id}
                  onClick={() => setSelected(goal.id)}
                  className={`
                    cursor-pointer p-6 rounded-xl border-2 transition-all duration-200
                    hover:border-primary/50 hover:bg-secondary/50
                    ${isSelected ? "border-primary bg-primary/5 shadow-lg scale-[1.02]" : "border-border bg-card"}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${isSelected ? "bg-primary/20" : "bg-secondary"}`}>
                      <Icon className={`h-6 w-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{goal.title}</h3>
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex justify-end">
            <Button size="lg" onClick={onNext} disabled={!selected} className="w-full md:w-auto px-8">
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
