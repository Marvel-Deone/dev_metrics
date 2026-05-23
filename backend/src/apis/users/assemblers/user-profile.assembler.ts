export function buildProfileResponse(raw: any) {
    const user = raw.user;

    //    HELPERS
    function groupPRsByWeek(prs: any[] = []) {
        const weeks: Record<string, any> = {};

        prs.forEach((pr) => {
            const date = new Date(pr.createdAt);
            const week = `W${Math.ceil(date.getDate() / 7)}`;

            if (!weeks[week]) {
                weeks[week] = { week, opened: 0, merged: 0, closed: 0 };
            }

            weeks[week].opened++;
            if (pr.state === "MERGED") weeks[week].merged++;
            if (pr.state === "CLOSED" && !pr.merged) weeks[week].closed++;
        });

        return Object.values(weeks);
    }

    function calculateTrend(prs: any[] = []) {
        const weeks = groupPRsByWeek(prs);

        if (weeks.length < 2) return "+0%";

        const last = weeks[weeks.length - 1].opened || 0;
        const prev = weeks[weeks.length - 2].opened || 0;

        if (prev === 0) return "+0%";

        const trend = ((last - prev) / prev) * 100;
        return `${trend >= 0 ? "+" : ""}${trend.toFixed(0)}%`;
    }

    // PR-based activity only (since commits are unreliable)
    function groupActivityByHour(prs: any[] = []) {
        const hours = Array.from({ length: 24 }, (_, h) => ({
            hour: h,
            count: 0,
        }));

        prs.forEach((pr) => {
            const hour = new Date(pr.createdAt).getHours();
            hours[hour].count++;
        });

        return hours;
    }

    //    LANGUAGES
    const languageTotals: Record<string, { size: number; color?: string }> = {};

    user.repositories.nodes.forEach((repo: any) => {
        (repo.languages?.edges ?? []).forEach((edge: any) => {
            const name = edge.node.name;

            if (!languageTotals[name]) {
                languageTotals[name] = {
                    size: 0,
                    color: edge.node.color,
                };
            }

            languageTotals[name].size += edge.size;
        });
    });

    const totalSize = Object.values(languageTotals).reduce(
        (sum, lang) => sum + lang.size,
        0
    );

    const languages = Object.entries(languageTotals)
        .map(([language, data]) => ({
            language,
            percentage:
                totalSize === 0
                    ? 0
                    : Number(((data.size / totalSize) * 100).toFixed(2)),
            color: data.color ?? "#94a3b8",
        }))
        .sort((a, b) => b.percentage - a.percentage);

    // MOST USED LANGUAGE
    const topLanguage = languages[0]?.language ?? "Unknown";

    //    PR STATS
    const prStats = {
        totalAuthored:
            user.contributionsCollection.pullRequestContributions.totalCount,
        totalReviewed:
            user.contributionsCollection.pullRequestReviewContributions.totalCount,
    };

    const allPRs = user.pullRequests?.nodes ?? [];

    const prWeeklyActivity = groupPRsByWeek(allPRs);

    //    CONTRIBUTIONS
    const contributions =
        user.contributionsCollection.contributionCalendar.weeks.flatMap(
            (w: any) => w.contributionDays
        );

    // LAST 7 DAYS
    const last7Days = contributions.slice(-7);

    const commitTrends = last7Days.map((day: any) => {
        const date = new Date(day.date);

        return {
            day: date.toLocaleDateString("en-US", { weekday: "short" }),
            commits: day.contributionCount,
        };
    });

    const totalCommits7Days = last7Days.reduce(
        (sum: number, d: any) => sum + d.contributionCount,
        0
    );

    const dayMap: Record<string, number> = {};

    contributions.forEach((day: any) => {
        const weekday = new Date(day.date).toLocaleDateString("en-US", {
            weekday: "long",
        });

        dayMap[weekday] = (dayMap[weekday] || 0) + day.contributionCount;
    });

    // Find peak day
    const peakDayEntry = Object.entries(dayMap).reduce(
        (max, curr) => (curr[1] > max[1] ? curr : max),
        ["Sunday", 0]
    );

    const peakDay = peakDayEntry[0];

    // ACTIVE REPOS
    const activeRepos = user.repositories.nodes.slice(0, 5).map((repo: any) => ({
        name: repo.name,
        url: repo.url,
        stars: repo.stargazerCount,
        forks: repo.forkCount,
        language: repo.languages?.edges?.[0]?.node?.name ?? "Unknown",
        color: repo.languages?.edges?.[0]?.node?.color ?? "#94a3b8",
        updatedAt: repo.updatedAt,
        trend: calculateTrend(repo.pullRequests?.nodes ?? []),
    }));

    // ACTIVITY
    const activeHours = groupActivityByHour(allPRs);

    const peakHour = activeHours.reduce(
        (max, h) => (h.count > max.count ? h : max),
        activeHours[0]
    );

    const mostActiveHour = {
        hour: peakHour.hour,
        count: peakHour.count,
    };

    // RECENT ACTIVITY
    const recentActivity: any[] = [];

    // PRs
    allPRs.forEach((pr: any) => {
        recentActivity.push({
            type: "pr",
            repo: pr.repository.name,
            message: pr.title,
            date: pr.createdAt,
        });
    });

    // COMMITS
    user.repositories.nodes.forEach((repo: any) => {
        const commits = repo.defaultBranchRef?.target?.history?.nodes ?? [];

        commits.forEach((commit: any) => {
            recentActivity.push({
                type: "commit",
                repo: repo.name,
                message: commit.messageHeadline,
                date: commit.committedDate,
            });
        });
    });

    // SORT & LIMIT
    recentActivity.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const recentActivityLimited = recentActivity.slice(0, 5);

    // FINAL RESPONSE
    return {
        user: {
            login: user.login,
            name: user.name,
            bio: user.bio,
            avatarUrl: user.avatarUrl,
            followers: user.followers.totalCount,
        },

        repos: user.repositories.nodes,
        activeRepos,

        languages,
        insights: {
            peakDay,
            topLanguage,
        },

        pullRequests: prStats.totalAuthored,
        prActivity: {
            ...prStats,
            weekly: prWeeklyActivity,
        },

        contributions,

        commitTrends,
        totalCommits7Days,

        activeHours,
        mostActiveHour,

        recentActivity: recentActivityLimited,
    };
}
