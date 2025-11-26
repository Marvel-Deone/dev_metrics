"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

export function ProductivityTrend() {
  const data = [
    { week: "Week 1", score: 45 },
    { week: "Week 2", score: 52 },
    { week: "Week 3", score: 48 },
    { week: "Week 4", score: 61 },
    { week: "Week 5", score: 55 },
    { week: "Week 6", score: 67 },
    { week: "Week 7", score: 72 },
    { week: "Week 8", score: 69 },
    { week: "Week 9", score: 78 },
    { week: "Week 10", score: 85 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productivity Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            score: {
              label: "Productivity Score",
              color: "hsl(var(--primary))",
            },
          }}
          className="h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="week"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="var(--color-score)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}