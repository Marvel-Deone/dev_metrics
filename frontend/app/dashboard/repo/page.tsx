"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"

import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { GitBranch, Star, GitCommit } from "lucide-react"
import { useRepos } from "@/hooks/use-repo"

export default function RepoListPage() {
  const { data: session } = useSession()

  const [page, setPage] = useState(1)
  const { data: repos, loading, hasMore } = useRepos(page)

  const loaderRef = useRef<HTMLDivElement | null>(null)

  // Intersection Observer (lazy load)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1)
        }
      },
      { threshold: 1 }
    )

    if (loaderRef.current) observer.observe(loaderRef.current)

    return () => observer.disconnect()
  }, [hasMore, loading])

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="p-4 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Repositories</h1>

        {/* Repo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {repos.map((repo) => (
            <Link
              key={repo.id}
              href={`/dashboard/repo/${repo.owner.login}/${repo.name}`}
            >
              <Card className="hover:bg-muted transition cursor-pointer">
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-muted">
                      <GitBranch className="h-5 w-5 text-primary" />
                    </div>

                    <div>
                      <p className="font-medium">{repo.name}</p>

                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {repo.stargazers_count}
                        </span>

                        <Badge variant="outline">
                          {repo.language || "N/A"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Loader */}
        {/* <div ref={loaderRef} className="h-10 flex items-center justify-center">
          {loading && <p className="text-muted-foreground">Loading...</p>}
        </div> */}
      </main>
    </div>
  )
}