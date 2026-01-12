type PR = {
    createdAt: string
    state: "MERGED" | "OPEN" | "CLOSED"
}

type WeeklyPRActivity = {
    week: string
    opened: number
    merged: number
    closed: number
}

/* ===================== UTIL ===================== */

function getISOWeek(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

/* ===================== TRANSFORMER ===================== */

export function toWeeklyPRActivity(
    prs: PR[],
    limit = 4
): WeeklyPRActivity[] {
    const map = new Map<number, WeeklyPRActivity>()

    prs.forEach(pr => {
        const date = new Date(pr.createdAt)
        const week = getISOWeek(date)

        if (!map.has(week)) {
            map.set(week, {
                week: `W${week}`,
                opened: 0,
                merged: 0,
                closed: 0,
            })
        }

        const bucket = map.get(week)!
        bucket.opened += 1

        if (pr.state === "MERGED") bucket.merged += 1
        if (pr.state === "CLOSED") bucket.closed += 1
    })

    return Array.from(map.values())
        .sort((a, b) => Number(a.week.slice(1)) - Number(b.week.slice(1)))
        .slice(-limit)
}

export function getLastYearGrid() {
    const today = new Date()
    const start = new Date(today)
    start.setDate(today.getDate() - 52 * 7)

    const weeks: Date[][] = []
    let current = new Date(start)

    for (let w = 0; w < 52; w++) {
        const week: Date[] = []
        for (let d = 0; d < 7; d++) {
            week.push(new Date(current))
            current.setDate(current.getDate() + 1)
        }
        weeks.push(week)
    }

    return weeks
}

export function formatGitHubDate(dateStr: string, count: number) {
    const date = new Date(dateStr)

    const formattedDate = date.toLocaleDateString("en-US", {
        month: "long",   // 👈 FULL month name
        day: "numeric",
        year: "numeric",
    })

    if (count === 0) {
        return `No contributions on ${formattedDate}`
    }

    return `${count} contribution${count > 1 ? "s" : ""} on ${formattedDate}`
}

export function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ]

  for (const i of intervals) {
    const value = Math.floor(seconds / i.seconds)
    if (value >= 1) {
      return `${value} ${i.label}${value > 1 ? "s" : ""} ago`
    }
  }

  return "just now"
}
