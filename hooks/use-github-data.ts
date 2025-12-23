"use client";

import { Repository } from "@/types/repository";
import { useCallback, useEffect, useState } from "react";

interface GitHubUser {
  login: string;
  name: string;
  bio: string;
  avatar_url: string;
  followers: number;
  public_repos: number;
  created_at: string;
  location?: string;
}

interface CommitTrend {
  day: string;
  commits: number;
}

// Cache expires every 10 minutes (can adjust)
const CACHE_DURATION = 1000 * 60 * 10;

export function useGitHubData(
  username: string | null | undefined,
  accessToken?: string
) {
  const [userData, setUserData] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [commitTrends, setCommitTrends] = useState<CommitTrend[]>([]);

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [lastSynced, setLastSynced] = useState<Date | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("devmetrics_last_synced");
      return stored ? new Date(stored) : null;
    }
    return null;
  });

  //  Load cached data instantly on first mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const cachedUser = localStorage.getItem("devmetrics_user");
    const cachedRepos = localStorage.getItem("devmetrics_repos");
    const cachedCommits = localStorage.getItem("devmetrics_commits");

    if (cachedUser) setUserData(JSON.parse(cachedUser));
    if (cachedRepos) setRepos(JSON.parse(cachedRepos));
    if (cachedCommits) setCommitTrends(JSON.parse(cachedCommits));

    setLoading(false);
  }, []);

  // Fetch commit trends helper
  async function fetchCommitTrends(
    username: string,
    token?: string
  ): Promise<CommitTrend[]> {
    const since = new Date();
    since.setDate(since.getDate() - 7);

    const headers: HeadersInit = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    // Fetch all repos
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100`,
      { headers }
    );
    if (!reposRes.ok) return [];
    const repos = await reposRes.json();

    // Prepare 7-day labels
    const dayLabels = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString("en-US", { weekday: "short" });
    });

    const commitMap: Record<string, number> = {};
    dayLabels.forEach((d) => (commitMap[d] = 0));

    // Fetch commits for each repo
    const commitFetches = repos.map(async (repo: any) => {
      const url = `https://api.github.com/repos/${repo.owner.login}/${repo.name}/commits?since=${since.toISOString()}`;
      const res = await fetch(url, { headers });
      if (!res.ok) return;

      const commits = await res.json();
      commits.forEach((c: any) => {
        const d = new Date(c.commit.author.date);
        const key = d.toLocaleDateString("en-US", { weekday: "short" });
        if (commitMap[key] !== undefined) commitMap[key] += 1;
      });
      console.log('commitsff:', commits);
    });

    await Promise.all(commitFetches);

    return Object.entries(commitMap).map(([day, commits]) => ({
      day,
      commits,
    }));
  }

  // Main GitHub fetcher with caching
  const fetchData = useCallback(
    async (isManualRefresh = false) => {
      if (!username) return;

      try {
        // Use cached data when not refreshing
        if (!isManualRefresh && lastSynced) {
          const age = Date.now() - lastSynced.getTime();
          if (age < CACHE_DURATION) {
            console.log("⏳ Using cached GitHub data — no API call");
            return;
          }
        }

        isManualRefresh ? setIsRefreshing(true) : setLoading(true);
        setError(null);

        const headers: HeadersInit = accessToken
          ? { Authorization: `Bearer ${accessToken}` }
          : {};

        // Fetch user
        const userRes = await fetch(
          `https://api.github.com/users/${username}`,
          { headers }
        );
        if (!userRes.ok) throw new Error("Failed to fetch user data");
        const user = await userRes.json();
        if (!user.login) throw new Error("Invalid GitHub user response");
        setUserData(user);

        // Fetch repos
        const reposRes = await fetch(
          `https://api.github.com/users/${username}/repos?sort=stars&per_page=100`,
          { headers }
        );
        if (!reposRes.ok) throw new Error("Failed to fetch repos");
        const repoData = await reposRes.json();
        setRepos(repoData);

        // Fetch commit trends
        const trends = await fetchCommitTrends(username, accessToken);
        setCommitTrends(trends);
        console.log('commitTrendsff:', trends);

        // Save to cache
        const now = new Date();
        setLastSynced(now);

        if (typeof window !== "undefined") {
          localStorage.setItem("devmetrics_user", JSON.stringify(user));
          localStorage.setItem("devmetrics_repos", JSON.stringify(repoData));
          localStorage.setItem("devmetrics_commits", JSON.stringify(trends));
          localStorage.setItem("devmetrics_last_synced", now.toISOString());
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error occurred");
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [username, accessToken, lastSynced]
  );

  //  Fetch when username or accessToken changes
  useEffect(() => {
    if (username) fetchData();
  }, [username, accessToken]);

  return {
    userData,
    repos,
    commitTrends,
    loading,
    error,
    lastSynced,
    isRefreshing,
    refetch: () => fetchData(true),
  };
}
