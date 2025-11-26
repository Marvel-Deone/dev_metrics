'use client';

import { Repository } from '@/types/repository';
import { useEffect, useState } from 'react';

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

// interface Repository {
//     name: string;
//     description?: string;
//     url: string;
//     stargazers_count: number;
//     forks_count: number;
//     watchers_count: number;
//     open_issues_count: number;
//     language?: string;
//     pushed_at?: string;
// }

export function useGitHubData(username: string | null | undefined) {
    const [userData, setUserData] = useState<GitHubUser | null>(null);
    const [repos, setRepos] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!username) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch user data
                const userRes = await fetch(`https://api.github.com/users/${username}`);
                if (!userRes.ok) throw new Error('Failed to fetch user data');
                const user = await userRes.json();
                setUserData(user);

                // Fetch repositories
                const reposRes = await fetch(
                    `https://api.github.com/users/${username}/repos?sort=stars&per_page=100`
                )
                if (!reposRes.ok) throw new Error('Failed to fetch repositories');
                const reposData = await reposRes.json();
                setRepos(reposData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [username]);

    return { userData, repos, loading, error }
}
