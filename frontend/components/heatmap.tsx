"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function Heatmap() {
  // Generate 365 days of mock data
  const today = new Date()
  const data = Array.from({ length: 365 }).map((_, i) => {
    const date = new Date(today)
    date.setDate(date.getDate() - (364 - i))

    // Random intensity 0-4
    // More weight to 0 and 1 to make it realistic
    const rand = Math.random()
    let intensity = 0
    if (rand > 0.8) intensity = 4
    else if (rand > 0.6) intensity = 3
    else if (rand > 0.4) intensity = 2
    else if (rand > 0.2) intensity = 1

    return {
      date,
      intensity,
      count: intensity === 0 ? 0 : Math.floor(Math.random() * 10) + 1,
    }
  })

  // Group by weeks
  const weeks = []
  let currentWeek: any[] = []

  data.forEach((day, i) => {
    if (day.date.getDay() === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek)
      currentWeek = []
    }
    currentWeek.push(day)
  })
  if (currentWeek.length > 0) weeks.push(currentWeek)

  const getIntensityClass = (intensity: number) => {
    switch (intensity) {
      case 1:
        return "bg-green-200 dark:bg-green-900/40"
      case 2:
        return "bg-green-400 dark:bg-green-700"
      case 3:
        return "bg-green-600 dark:bg-green-500"
      case 4:
        return "bg-green-800 dark:bg-green-300"
      default:
        return "bg-secondary/50"
    }
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Contribution Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto pb-4">
          <div
            className="grid gap-[3px] min-w-max lg:min-w-0 lg:w-full"
            style={{
              gridTemplateColumns: `repeat(${weeks.length}, minmax(8px, 1fr))`,
            }}
          >
            {weeks.map((week, i) => (
              <div key={i} className="grid gap-[3px]" style={{ gridTemplateRows: "repeat(7, 1fr)" }}>
                {i === 0 &&
                  week.length < 7 &&
                  Array.from({ length: 7 - week.length }).map((_, k) => (
                    <div key={`pad-${k}`} className="aspect-square rounded-sm invisible" />
                  ))}
                {week.map((day, j) => (
                  <TooltipProvider key={j}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`aspect-square min-w-[8px] min-h-[8px] max-w-[14px] max-h-[14px] rounded-sm transition-colors hover:ring-1 ring-offset-1 ring-foreground/20 ${getIntensityClass(day.intensity)}`}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          {day.count} contributions on {day.date.toLocaleDateString()}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4 justify-end">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-secondary/50" />
          <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900/40" />
          <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700" />
          <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500" />
          <div className="w-3 h-3 rounded-sm bg-green-800 dark:bg-green-300" />
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  )
}
