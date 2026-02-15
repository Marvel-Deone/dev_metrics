"use client";

import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";

export interface Repository {
  name: string;
  url: string;
  isPrivate: boolean;
  stargazerCount: number;
  forkCount: number;
  updatedAt: string;
}

export interface GitHubUser {
  login: string;
  name: string;
  avatarUrl: string;
  bio: string;
  followers: number;
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

export interface Data {
  repos: Repository[],
  user: GitHubUser | null,
  activeRepos: ActiveRepository[],
  languages: LanguageStat[],
  commitTrends: CommitTrend[],
  totalCommits7Days: 0,
  pullRequests: number,
  prActivity: {
    weekly: []
  },
  recentActivity: RecentActivityItem[],
  activeHours: ActiveHour[],
  mostActiveHour: ActiveHour,
  contributions: ContributionDay[]
}

export function useGitHubData() {
  const [data, setData] = useState<Data>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);

        const res = await apiFetch(`/users/profile`);

        setData(res);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  return {
    user: data?.user,
    repos: data?.repos,
    activeRepos: data?.activeRepos,
    languages: data?.languages,
    commitTrends: data?.commitTrends,
    totalCommits7Days: data?.totalCommits7Days,
    pullRequests: data?.pullRequests,
    prActivity: data?.prActivity,
    recentActivity: data?.recentActivity,
    activeHours: data?.activeHours,
    mostActiveHour: data?.mostActiveHour,
    contributionCalendar: data?.contributions,
    loading,
    error,
  };
}
