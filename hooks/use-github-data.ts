"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface Repository {
  name: string;
  url: string;
  isPrivate: boolean;
  stargazerCount: number;
  forkCount: number;
  updatedAt: string;
}

export interface ActiveRepository {
  name: string;
  url: string;
  isPrivate: boolean;
  language: string;
  stars: number;
  trends: string;
  commits: string;
  stargazerCount: number;
  forkCount: number;
  updatedAt: string;
}

export interface ActiveHour {
  hour: number;
  count: number;
}

export interface GitHubUser {
  login: string;
  name: string;
  avatarUrl: string;
  bio: string;
  followers: number;
}

export interface CommitTrend {
  day: string;
  commits: number;
}

export interface LanguageStat {
  language: string;
  percentage: number;
}

export interface ContributionDay {
  date: string;
  count: number;
  color: string;
}

export type RecentActivityType = "commit" | "pr"

export interface RecentActivityItem {
  type: RecentActivityType
  repo: string
  message: string
  date: string // ISO string from GitHub
}

export function useGitHubData() {
  const fetchedRef = useRef(false);

  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [languages, setLanguages] = useState<LanguageStat[]>([]);
  const [commitTrends, setCommitTrends] = useState<CommitTrend[]>([]);
  const [totalCommits7Days, setTotalCommits7Days] = useState(0);
  const [pullRequests, setPullRequests] = useState(0);
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);
  const [prActivity, setprActivity] = useState({
    weekly: []
  });
  const [activeRepos, setActiveRepos] = useState<ActiveRepository[]>([]);
  const [activeHours, setActiveHours] = useState<ActiveHour[]>([]);
  const [mostActiveHour, setMostActiveHour] = useState<ActiveHour>();
  const [contributionCalendar, setContributionCalendar] =
    useState<ContributionDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    const res = await fetch("/api/github/profile");

    if (!res.ok) {
      throw new Error("Not authenticated or profile fetch failed");
    }

    const data = await res.json();
    setUser(data.user);
    setRepos(data.repos);
    setLanguages(data.languages);
    setPullRequests(data.pullRequests);
    setContributionCalendar(data.contributions);
    setprActivity(data.prActivity);
    setActiveRepos(data.activeRepos);
    setRecentActivity(data.recentActivity);
    setActiveHours(data.activeHours);
    setMostActiveHour(data.mostActiveHour);
  };

  const fetchCommits = async () => {
    const res = await fetch("/api/github/commits");

    if (!res.ok) {
      throw new Error("Commit fetch failed");
    }

    const data = await res.json();

    setCommitTrends(data.trends);
    setTotalCommits7Days(data.total);
  };

  const fetchAll = useCallback(async () => {
    if (fetchedRef.current) {
      return;
    }

    fetchedRef.current = true;

    try {
      setLoading(true);

      await Promise.all([
        fetchProfile(),
        fetchCommits(),
      ]);
    } catch (err: any) {
      setError(err.message || "Failed to load GitHub data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    user,
    repos,
    activeRepos,
    languages,
    commitTrends,
    totalCommits7Days,
    pullRequests,
    prActivity,
    contributionCalendar,
    recentActivity,
    activeHours,
    mostActiveHour,
    loading,
    error,
  };
}
