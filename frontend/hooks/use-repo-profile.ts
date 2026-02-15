"use client";

import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";

export type RepoProfile = {
    details: any;
    timeline: {
        month: string;
        commits: number;
        prs: number;
    }[];
};

export function useRepoProfile(owner?: string, repo?: string) {
    const [data, setData] = useState<RepoProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!owner || !repo) return;

        const controller = new AbortController();

        (async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await apiFetch(
                    `/repos/${owner}/${repo}/profile`,
                    {
                        signal: controller.signal,
                    }
                );

                setData(res);
            } catch (err: any) {
                if (err.name === "AbortError") return;
                setError(err.message);
                setData(null);
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, [owner, repo]);

    return { data, loading, error };
}
