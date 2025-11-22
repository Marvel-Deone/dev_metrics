'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GitFork, Star, GitPullRequest, AlertCircle, CodeIcon } from 'lucide-react'

interface Repository {
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  language?: string
}

export function StatsCards({ repos }: { repos: Repository[] }) {
  const stats = repos.reduce(
    (acc, repo) => ({
      totalStars: acc.totalStars + repo.stargazers_count,
      totalForks: acc.totalForks + repo.forks_count,
      totalIssues: acc.totalIssues + repo.open_issues_count,
      languages: acc.languages.add(repo.language || 'Unknown'),
    }),
    { totalStars: 0, totalForks: 0, totalIssues: 0, languages: new Set<string>() }
  )

  const cards = [
    {
      title: "Total Stars",
      value: stats.totalStars,
      icon: Star,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Total Forks",
      value: stats.totalForks,
      icon: GitFork,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Open Issues",
      value: stats.totalIssues,
      icon: AlertCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      title: "Languages",
      value: stats.languages.size,
      icon: CodeIcon,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title} className="border border-border/50 bg-linear-to-br from-card to-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.title.toLowerCase()}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
