import { Button } from "@/components/ui/button"
import { Github, Home } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6 px-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
          <Github className="w-10 h-10 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">User Not Found</h1>
          <p className="text-muted-foreground max-w-md">
            We couldn't find a GitHub user with that username. Please check the URL and try again.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
          <Link href="/auth/signin">
            <Button className="gap-2">
              <Github className="w-4 h-4" />
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}