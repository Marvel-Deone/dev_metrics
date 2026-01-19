"use client"

import { useEffect, useState } from "react";

export function useRepoDetails(owner?: string, repo?: string, token?: string) {
  const [repoDetails, setRepoDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);

    const ready = Boolean(owner && repo && token);

    if (!ready) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/github/repo?owner=${encodeURIComponent(owner!)}&repo=${encodeURIComponent(repo!)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        );

        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(json?.message || "Failed to fetch repo");

        setRepoDetails(json);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setRepoDetails(null);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [owner, repo, token]);

  return { repoDetails, loading, error };
}

export type TimelinePoint = {
  month: string;
  commits: number;
  prs: number;
};

export function useRepoTimeline(owner?: string, repo?: string, token?: string) {
  const [timeline, setTimeline] = useState<TimelinePoint[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);

    const ready = Boolean(owner && repo && token);
    if (!ready) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/github/repo/${encodeURIComponent(owner!)}/${encodeURIComponent(repo!)}/timeline`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        );

        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(json?.message || "Failed to fetch timeline");

        setTimeline(json?.timeline ?? []);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setTimeline(null);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [owner, repo, token]);

  return { timeline, loading, error };
}