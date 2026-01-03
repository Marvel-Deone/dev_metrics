"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ===================== TYPES ===================== */

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

export function useGitHubData() {
  console.log("useGitHubData: hook init");

  const fetchedRef = useRef(false);

  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [languages, setLanguages] = useState<LanguageStat[]>([]);
  const [commitTrends, setCommitTrends] = useState<CommitTrend[]>([]);
  const [totalCommits7Days, setTotalCommits7Days] = useState(0);
  const [pullRequests, setPullRequests] = useState(0);
  const [contributionCalendar, setContributionCalendar] =
    useState<ContributionDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    console.log("fetchProfile: start");

    const res = await fetch("/api/github/profile");

    console.log("fetchProfile: response", res.status);

    if (!res.ok) {
      throw new Error("Not authenticated or profile fetch failed");
    }

    const data = await res.json();
    console.log("fetchProfisle: data", data, data.languages);

    setUser(data.user);
    setRepos(data.repos);
    setLanguages(data.languages);
    setPullRequests(data.pullRequests);
    setContributionCalendar(data.contributions);
  };

  const fetchCommits = async () => {
    console.log("fetchCommits: start");

    const res = await fetch("/api/github/commits");

    console.log("fetchCommits: response", res.status);

    if (!res.ok) {
      throw new Error("Commit fetch failed");
    }

    const data = await res.json();
    console.log("fetchCommits: data", data);

    setCommitTrends(data.trends);
    setTotalCommits7Days(data.total);
  };

  const fetchAll = useCallback(async () => {
    console.log("fetchAll: called");

    if (fetchedRef.current) {
      console.log("fetchAll: already fetched, skipping");
      return;
    }

    fetchedRef.current = true;

    try {
      setLoading(true);
      console.log("fetchAll: loading");

      await Promise.all([
        fetchProfile(),
        fetchCommits(),
      ]);

      console.log("fetchAll: success");
    } catch (err: any) {
      console.error("fetchAll error:", err);
      setError(err.message || "Failed to load GitHub data");
    } finally {
      setLoading(false);
      console.log("fetchAll: done");
    }
  }, []);

  useEffect(() => {
    console.log("useEffect: mounting");
    fetchAll();
  }, [fetchAll]);

  return {
    user,
    repos,
    languages,
    commitTrends,
    totalCommits7Days,
    pullRequests,
    contributionCalendar,
    loading,
    error,
  };
}
