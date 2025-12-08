"use client";

import { useEffect, useState } from "react";
import { githubGraphQL } from "@/lib/githubClient";
import { GITHUB_METRICS_QUERY } from "@/lib/githubQuery";

type ContributionDay = {
  date: string;
  contributionCount: number;
};

export function useGithubMetrics(username: string) {
  const [metrics, setMetrics] = useState({
    commits: 0,
    prs: 0,
    reviews: 0,
    streak: 0,
    bestStreak: 0,
    loading: true,
  });

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const data = await githubGraphQL<any>(GITHUB_METRICS_QUERY, { login: username });
        const contrib = data.user.contributionsCollection;

        const days: ContributionDay[] = contrib.contributionCalendar.weeks
          .flatMap((week: any) => week.contributionDays);

        // Calculate streak
        let streak = 0;
        for (let i = days.length - 1; i >= 0; i--) {
          if (days[i].contributionCount > 0) streak++;
          else break;
        }

        // Calculate best streak
        let best = 0;
        let current = 0;

        for (const day of days) {
          if (day.contributionCount > 0) current++;
          else {
            best = Math.max(best, current);
            current = 0;
          }
        }
        best = Math.max(best, current);

        setMetrics({
          commits: contrib.totalCommitContributions,
          prs: contrib.totalPullRequestContributions,
          reviews: contrib.totalPullRequestReviewContributions,
          streak,
          bestStreak: best,
          loading: false,
        });
      } catch (err) {
        console.error(err);
      }
    }

    fetchMetrics();
  }, [username]);

  return metrics;
}