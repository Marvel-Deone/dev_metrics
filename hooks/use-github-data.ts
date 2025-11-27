// 'use client';

// import { useEffect, useState } from 'react';
// import { Repository } from '@/types/repository';

// interface GitHubUser {
//     login: string;
//     name: string;
//     bio: string;
//     avatar_url: string;
//     followers: number;
//     public_repos: number;
//     created_at: string;
//     location?: string;
// }

// interface UseGitHubDataReturn {
//     userData: GitHubUser | null;
//     repos: Repository[];
//     repoDetails: Repository | null;
//     loading: boolean;
//     error: string | null;
// }

// export function useGitHubData(
//     username?: string | null,
//     accessToken?: string,
//     repoName?: string // 👈 Only pass this when you want details for a single repo
// ): UseGitHubDataReturn {
//     const [userData, setUserData] = useState<GitHubUser | null>(null);
//     const [repos, setRepos] = useState<Repository[]>([]);
//     const [repoDetails, setRepoDetails] = useState<Repository | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         if (!username) {
//             setLoading(false);
//             return;
//         }

//         const headers = accessToken
//             ? { Authorization: `token ${accessToken}` }
//             : undefined;

//         const fetchAll = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);

//                 // Fetch User
//                 const userRes = await fetch(
//                     `https://api.github.com/users/${username}`,
//                     { headers }
//                 );
//                 if (!userRes.ok) throw new Error('Failed to fetch user');
//                 setUserData(await userRes.json());

//                 // Fetch Repos (Top 6)
//                 const reposRes = await fetch(
//                     `https://api.github.com/users/${username}/repos?sort=stars&per_page=100`,
//                     { headers }
//                 );
//                 if (!reposRes.ok) throw new Error('Failed to fetch repositories');
//                 setRepos(await reposRes.json());

//                 // Fetch Single Repo Details (optional)
//                 if (repoName) {
//                     const repoRes = await fetch(
//                         `https://api.github.com/repos/${username}/${repoName}`,
//                         { headers }
//                     );
//                     if (!repoRes.ok) throw new Error('Failed to fetch repository details');
//                     setRepoDetails(await repoRes.json());
//                 } else {
//                     setRepoDetails(null);
//                 }

//             } catch (err) {
//                 setError(err instanceof Error ? err.message : 'Unexpected error occurred');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchAll();
//     }, [username, repoName, accessToken]);

//     return {
//         userData,
//         repos,
//         repoDetails,
//         loading,
//         error,
//     };
// }

"use client"

import { Repository } from "@/types/repository"
import { useCallback, useEffect, useState } from "react"

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

// interface Repository {
//   name: string
//   description?: string
//   url: string
//   stargazers_count: number
//   forks_count: number
//   watchers_count: number
//   open_issues_count: number
//   language?: string
//   pushed_at?: string
// }

export function useGitHubData(username: string | null | undefined, accessToken?: string) {
  const [userData, setUserData] = useState<GitHubUser | null>(null)
  const [repos, setRepos] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastSynced, setLastSynced] = useState<Date | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("devmetrics_last_synced")
      return stored ? new Date(stored) : null
    }
    return null
  })
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchData = useCallback(
    async (isManualRefresh = false) => {
      if (!username) {
        setLoading(false)
        return
      }

      try {
        if (isManualRefresh) {
          setIsRefreshing(true)
        } else {
          setLoading(true)
        }
        setError(null)

        const headers: HeadersInit = accessToken ? { Authorization: `Bearer ${accessToken}` } : {}

        // Fetch user data
        const userRes = await fetch(`https://api.github.com/users/${username}`, { headers })
        if (!userRes.ok) throw new Error("Failed to fetch user data")
        const user = await userRes.json()
        setUserData(user)

        // Fetch repositories
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=100`, {
          headers,
        })
        if (!reposRes.ok) throw new Error("Failed to fetch repositories")
        const reposData = await reposRes.json()
        setRepos(reposData)

        // Update last synced time
        const now = new Date()
        setLastSynced(now)
        if (typeof window !== "undefined") {
          localStorage.setItem("devmetrics_last_synced", now.toISOString())
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
        setIsRefreshing(false)
      }
    },
    [username, accessToken],
  )

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(() => {
    fetchData(true)
  }, [fetchData])

  return { userData, repos, loading, error, lastSynced, isRefreshing, refetch }
}