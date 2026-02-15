"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Metrics = {
  commits: number;
  prs: number;
  reviews: number;
  streak: number;
  bestStreak: number;
};

export function useGithubMetrics() {
  const [metrics, setMetrics] = useState<Metrics>({
    commits: 0,
    prs: 0,
    reviews: 0,
    streak: 0,
    bestStreak: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchMetrics() {
      try {
        const res = await apiFetch(`/analytics/overview`);

        if (mounted) {
          setMetrics({
            commits: res.commits ?? 0,
            prs: res.prs ?? 0,
            reviews: res.reviews ?? 0,
            streak: res.streak ?? 0,
            bestStreak: res.bestStreak ?? 0,
          });
        }
      } catch (err: any) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchMetrics();

    return () => {
      mounted = false;
    };
  }, []);

  return { metrics, loading, error };
}
