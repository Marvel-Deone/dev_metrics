import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProfileCard } from "@/components/profile-card"
import { StatsCards } from "@/components/stats-cards"
import { LanguagesChart } from "@/components/languages-chart"
import { Heatmap } from "@/components/heatmap"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Github, ExternalLink } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: Promise<{ username: string }>
}

// Fetch GitHub user data server-side
async function getGitHubUser(username: string) {
  const res = await fetch(`https://api.github.com/users/${username}`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  })

  if (!res.ok) return null
  return res.json()
}

// Fetch GitHub repos server-side
async function getGitHubRepos(username: string) {
  const res = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=100`, {
    next: { revalidate: 3600 },
  })

  if (!res.ok) return []
  return res.json()
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params
  const user = await getGitHubUser(username)

  if (!user) {
    return { title: "User Not Found | DevMetrics" }
  }

  return {
    title: `${user.name || user.login} | DevMetrics`,
    description: user.bio || `Check out ${user.login}'s GitHub analytics and developer metrics.`,
    openGraph: {
      title: `${user.name || user.login} | DevMetrics`,
      description: user.bio || `Check out ${user.login}'s GitHub analytics.`,
      images: [user.avatar_url],
    },
  }
}

const PublicProfilePage = async ({ params }: PageProps) => {
  const { username } = await params

  // Fetch data in parallel
  const [user, repos] = await Promise.all([getGitHubUser(username), getGitHubRepos(username)])

  if (!user) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">D</span>
              </div>
              <span className="font-bold text-lg text-foreground">DevMetrics</span>
            </div>
          </div>

          <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Github className="w-4 h-4" />
              View on GitHub
              <ExternalLink className="w-3 h-3" />
            </Button>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Public Profile Banner */}
        <div className="bg-linear-to-r from-primary/10 via-accent/10 to-primary/10 rounded-lg p-4 border border-border/50">
          <p className="text-center text-sm text-muted-foreground">
            This is a public profile page for <span className="font-semibold text-foreground">@{username}</span>
          </p>
        </div>

        {/* Profile Card */}
        <ProfileCard user={user} />

        {/* Stats Cards */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Developer Metrics</h2>
          <StatsCards repos={repos} />
        </section>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contribution Heatmap */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Contribution Activity</h2>
            {/* <Heatmap username={username} /> */}
            <Heatmap />
          </section>

          {/* Languages Chart */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Top Languages</h2>
            <LanguagesChart repos={repos} />
          </section>
        </div>

        {/* Footer CTA */}
        <div className="text-center py-8 border-t border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-2">Want your own DevMetrics profile?</h3>
          <p className="text-muted-foreground mb-4">
            Sign in with GitHub to get detailed analytics and insights about your coding activity.
          </p>
          <Link href="/auth/signin">
            <Button className="gap-2">
              <Github className="w-4 h-4" />
              Get Started Free
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default PublicProfilePage