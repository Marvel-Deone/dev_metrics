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