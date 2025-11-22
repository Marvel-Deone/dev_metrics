'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Users, Calendar, MapPin } from 'lucide-react'
import Image from "next/image"

interface GitHubUser {
  login: string
  name: string
  bio: string
  avatar_url: string
  followers: number
  public_repos: number
  created_at: string
  location?: string
}

export function ProfileCard({ user }: { user: GitHubUser }) {
  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })

  return (
    <Card className="border border-border/50 overflow-hidden bg-gradient-to-br from-card to-card/50 shadow-lg backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="flex-shrink-0">
            <Image
              src={user.avatar_url || "/placeholder.svg"}
              alt={user.login}
              width={120}
              height={120}
              className="rounded-full ring-4 ring-primary/20 shadow-lg"
            />
          </div>

          <div className="flex-1">
            <div className="mb-4">
              <h2 className="text-3xl font-bold text-foreground">{user.name || user.login}</h2>
              <p className="text-primary font-semibold">@{user.login}</p>
            </div>

            {user.bio && (
              <p className="text-muted-foreground mb-4 text-sm">{user.bio}</p>
            )}

            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-accent" />
                <span className="text-foreground font-semibold">{user.followers}</span>
                <span className="text-muted-foreground">followers</span>
              </div>

              {user.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span className="text-muted-foreground">{user.location}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" />
                <span className="text-muted-foreground">Joined {joinDate}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
