"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface Repository {
  language?: string
}

const LanguagesChart = ({ repos }: { repos: Repository[] }) => {
  const languageCounts = repos.reduce(
    (acc, repo) => {
      const lang = repo.language || "Other"
      acc[lang] = (acc[lang] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const languageColors: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f7df1e",
    Python: "#3776ab",
    Java: "#007396",
    "C++": "#00599c",
    C: "#555555",
    Go: "#00add8",
    Rust: "#ce422b",
    Ruby: "#cc342d",
    PHP: "#777bb4",
    Swift: "#f05138",
    Kotlin: "#7f52ff",
    Dart: "#0175c2",
    SCSS: "#cc6699",
    CSS: "#1572b6",
    HTML: "#e34f26",
    Vue: "#42b883",
    React: "#61dafb",
    Shell: "#89e051",
    Other: "#8b949e",
  }

  const chartData = Object.entries(languageCounts)
    .slice(0, 5)
    .map(([name, value]) => ({
      name,
      value,
      fill: languageColors[name] || "#8b949e",
    }))

  return (
    <Card className="border border-border/50 bg-linear-to-br from-card to-card/50 backdrop-blur-sm">
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
                stroke="hsl(var(--background))"
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export { LanguagesChart };