"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Github, LogOut, Moon, Sun, Settings, Activity, RefreshCw, Bell, ChevronDown, Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useGitHubData } from "@/hooks/use-github-data"

export function DashboardHeader() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // const { userData: user, repos, loading, error } = useGitHubData(session?.user?.login);
  const { user, repos, loading, error } = useGitHubData();
  useEffect(() => {
    setMounted(true)
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsRefreshing(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 md:px-6 h-16 max-w-[90rem] mx-auto overflow-hidden">
        {/* Left side - Logo and nav */}
        <div className="flex items-center gap-4 md:gap-6 min-w-0">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Activity className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground hidden sm:inline">DevMetrics</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-foreground font-medium">
                Overview
              </Button>
            </Link>
            <Link href="/dashboard/repositories">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Repositories
              </Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Analytics
              </Button>
            </Link>
            <Link href="/dashboard/goals">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Goals
              </Button>
            </Link>
          </nav>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-1 md:gap-2 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className={`h-9 w-9 ${isRefreshing ? "animate-spin" : ""}`}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="relative h-9 w-9 hidden sm:flex">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary rounded-full" />
          </Button>

          {/* User dropdown - desktop */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 pl-2 hidden sm:flex cursor-pointer!">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user?.avatarUrl || "/developer-avatar.png"} />
                  <AvatarFallback>{user?.login?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline text-sm max-w-[120px] truncate">{user?.login || "User"}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive cursor-pointer" onClick={() => signOut({ callbackUrl: "/auth/signin" })}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background p-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-2">
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-foreground font-medium">
                Overview
              </Button>
            </Link>
            <Link href="/dashboard/repositories" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                Repositories
              </Button>
            </Link>
            <Link href="/dashboard/analytics" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                Analytics
              </Button>
            </Link>
            <Link href="/dashboard/goals" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                Goals
              </Button>
            </Link>
            <div className="border-t border-border my-2" />
            <div className="flex items-center gap-3 px-3 py-2">
              <Avatar className="h-8 w-8">
                {/* <AvatarImage src={user?.avatar_url || "/developer-avatar.png"} /> */}
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.name || "user@example.com"}</p>
              </div>
            </div>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={() => {
                signOut({ callbackUrl: "/auth/signin" })
                setMobileMenuOpen(false)
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}