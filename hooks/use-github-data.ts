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

const useGitHubData = (username: string | null | undefined, accessToken?: string) => {
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
                    `https://api.github.com/users/${username}/repos?sort=stars&per_page=6`
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

export { useGitHubData };