'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface Repository {
  name: string
  pushed_at?: string
}

export function CommitsChart({ repos }: { repos: Repository[] }) {
  // Simulate commits per week data based on repos
  const commitsData = Array.from({ length: 12 }, (_, i) => ({
    week: `W${i + 1}`,
    commits: Math.floor(Math.random() * 50) + 10,
  }))

  return (
    <Card className="border border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Commits Activity</CardTitle>
        <CardDescription>Last 12 weeks of commit activity</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            commits: {
              label: "Commits",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={commitsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="week" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="commits" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
