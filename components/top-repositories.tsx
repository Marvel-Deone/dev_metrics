'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, GitFork, Eye } from 'lucide-react'

interface Repository {
  name: string
  description?: string
  url: string
  stargazers_count: number
  forks_count: number
  watchers_count: number
  language?: string
}

const TopRepositories = ({ repos }: { repos: Repository[] }) => {
  const topRepos = repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6)

  return (
    <Card className="border border-border/50 bg-linear-to-br from-card to-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Top Repositories</CardTitle>
        <CardDescription>Your most starred repositories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topRepos.map((repo) => (
            <a
              key={repo.name}
              href={`/dashboard/repo/${repo.name}`}
              // target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-background hover:border-primary/50 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {repo.name}
                </h3>
                {repo.language && (
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary ml-2 shrink-0">
                    {repo.language}
                  </span>
                )}
              </div>

              {repo.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {repo.description}
                </p>
              )}

              <div className="flex gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span>{repo.stargazers_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <GitFork className="w-3 h-3 text-blue-500" />
                  <span>{repo.forks_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-green-500" />
                  <span>{repo.watchers_count}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export { TopRepositories };