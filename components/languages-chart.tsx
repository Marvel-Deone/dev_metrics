'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface Repository {
  language?: string
}

export function LanguagesChart({ repos }: { repos: Repository[] }) {
  const languageCounts = repos.reduce(
    (acc, repo) => {
      const lang = repo.language || 'Other'
      acc[lang] = (acc[lang] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ]

  const chartData = Object.entries(languageCounts)
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }))

  return (
    <Card className="border border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Top Languages</CardTitle>
        <CardDescription>Distribution of programming languages</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            repos: {
              label: "Repositories",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value }) => `${name} (${value})`}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
