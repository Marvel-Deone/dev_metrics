'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { GitCommit } from "lucide-react"
import { Badge } from "./ui/badge"

interface Repository {
  name: string
  pushed_at?: string
}

// Custom tooltip component for proper theming
const CustomTooltip = ({
  active,
  payload,
  label,
}: { active?: boolean; payload?: Array<{ name: string; value: number; color?: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
        {label && <p className="text-sm font-medium text-foreground mb-1">{label}</p>}
        {payload.map((entry, index) => (
          <p key={index} className="text-sm text-muted-foreground">
            <span className="capitalize">{entry.name}</span>:{" "}
            <span className="font-medium text-foreground">{entry.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

const CommitsChart = ({ commitTrends }: { commitTrends: any[] }) => {
  // Simulate commits per week data based on repos
  const commitsData = Array.from({ length: 12 }, (_, i) => ({
    week: `W${i + 1}`,
    commits: Math.floor(Math.random() * 50) + 10,
  }))
  //    // Fetch commit trends
  // const trends = await fetchCommitTrends(username, accessToken);
  // setCommitTrends(trends);
  return (
    // <Card className="border border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
    //   <CardHeader>
    //     <CardTitle>Commits Activity</CardTitle>
    //     <CardDescription>Last 12 weeks of commit activity</CardDescription>
    //   </CardHeader>
    //   <CardContent>
    //     <ChartContainer
    //       config={{
    //         commits: {
    //           label: "Commits",
    //           color: "hsl(var(--chart-1))",
    //         },
    //       }}
    //       className="h-[300px]"
    //     >
    //       <ResponsiveContainer width="100%" height="100%">
    //         <BarChart data={commitsData}>
    //           <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
    //           <XAxis dataKey="week" stroke="var(--muted-foreground)" />
    //           <YAxis stroke="var(--muted-foreground)" />
    //           <ChartTooltip content={<ChartTooltipContent />} />
    //           <Bar dataKey="commits" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
    //         </BarChart>
    //       </ResponsiveContainer>
    //     </ChartContainer>
    //   </CardContent>
    // </Card>
    <Card className="lg:col-span-2 animate-slide-up stagger-1 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <GitCommit className="h-5 w-5 text-primary" />
            Commit Trends
          </CardTitle>
          <CardDescription>Your commit activity this week</CardDescription>
        </div>
        <Badge variant="secondary" className="font-mono">
          87 commits
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-hidden h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={commitTrends}>
              <defs>
                <linearGradient id="commitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.65 0.2 155)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.65 0.2 155)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.01 285)" opacity={0.3} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="commits"
                stroke="oklch(0.65 0.2 155)"
                strokeWidth={2}
                fill="url(#commitGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export { CommitsChart };