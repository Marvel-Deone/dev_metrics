"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, GitFork, Activity, Clock } from "lucide-react"
import Link from "next/link"
import { Repository } from "@/types/repository"

// interface Repository {
    // name: string
    // description?: string
    // url: string
    // html_url: string
    // stargazers_count: number
    // forks_count: number
    // watchers_count: number
    // language?: string
    // pushed_at: string
    // open_issues_count: number
// }

type SortKey = "stars" | "forks" | "activity" | "updated"

const RepositoryRanking = ({ repos }: { repos: Repository[] }) => {
    const [sortKey, setSortKey] = useState<SortKey>("stars")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

    const sortRepos = (a: Repository, b: Repository) => {
        let valA, valB
        switch (sortKey) {
            case "stars":
                valA = a.stargazers_count
                valB = b.stargazers_count
                break
            case "forks":
                valA = a.forks_count
                valB = b.forks_count
                break
            case "activity":
                valA = a.open_issues_count + a.forks_count
                valB = b.open_issues_count + b.forks_count
                break
            case "updated":
                valA = new Date(a.pushed_at).getTime()
                valB = new Date(b.pushed_at).getTime()
                break
        }
        return sortDirection === "desc" ? valB - valA : valA - valB
    }

    const sortedRepos = [...repos].sort(sortRepos)

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortKey(key)
            setSortDirection("desc")
        }
    }

    return (
        <Card className="col-span-full border border-border/50 bg-linear-to-br from-card to-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <CardTitle>Repository Ranking</CardTitle>
                    <CardDescription>Sort and filter your repositories by performance metrics</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={sortKey === "stars" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => handleSort("stars")}
                        className="gap-2"
                    >
                        <Star className="w-4 h-4" /> Stars
                    </Button>
                    <Button
                        variant={sortKey === "forks" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => handleSort("forks")}
                        className="gap-2"
                    >
                        <GitFork className="w-4 h-4" /> Forks
                    </Button>
                    <Button
                        variant={sortKey === "activity" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => handleSort("activity")}
                        className="gap-2"
                    >
                        <Activity className="w-4 h-4" /> Activity
                    </Button>
                    <Button
                        variant={sortKey === "updated" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => handleSort("updated")}
                        className="gap-2"
                    >
                        <Clock className="w-4 h-4" /> Recent
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {sortedRepos.map((repo, index) => (
                        <Link
                            key={repo.name}
                            href={`/dashboard/repo/${repo.name}`}
                            className="block p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-background hover:border-primary/50 transition-all duration-200 group"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-lg font-bold text-muted-foreground w-6">#{index + 1}</span>
                                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                            {repo.name}
                                        </h3>
                                        {repo.language && (
                                            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary flex-shrink-0">
                                                {repo.language}
                                            </span>
                                        )}
                                    </div>
                                    {repo.description && (
                                        <p className="text-sm text-muted-foreground line-clamp-1 ml-9">{repo.description}</p>
                                    )}
                                </div>

                                <div className="flex items-center gap-6 text-sm text-muted-foreground ml-9 md:ml-0">
                                    <div className="flex items-center gap-1 min-w-[60px]">
                                        <Star className="w-4 h-4 text-yellow-500" />
                                        <span className="font-medium text-foreground">{repo.stargazers_count}</span>
                                    </div>
                                    <div className="flex items-center gap-1 min-w-[60px]">
                                        <GitFork className="w-4 h-4 text-blue-500" />
                                        <span className="font-medium text-foreground">{repo.forks_count}</span>
                                    </div>
                                    <div className="flex items-center gap-1 min-w-[60px]">
                                        <Activity className="w-4 h-4 text-green-500" />
                                        <span className="font-medium text-foreground">{repo.open_issues_count}</span>
                                    </div>
                                    <div className="text-xs w-24 text-right">{new Date(repo.pushed_at).toLocaleDateString()}</div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export { RepositoryRanking };