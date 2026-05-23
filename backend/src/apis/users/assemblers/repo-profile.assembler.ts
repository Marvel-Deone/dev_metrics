export function buildRepoProfile(raw: any) {
    const repo = raw.repository;

    // Timeline (group by month)
    const timelineMap: Record<string, { commits: number; prs: number }> = {};

    const commits =
        repo.defaultBranchRef?.target?.history?.nodes ?? [];

    const prs = repo.pullRequests?.nodes ?? [];

    function getMonthKey(date: string) {
        const d = new Date(date);
        return `${d.getFullYear()}-${d.getMonth() + 1}`;
    }

    // Count commits
    commits.forEach((c: any) => {
        const key = getMonthKey(c.committedDate);

        if (!timelineMap[key]) {
            timelineMap[key] = { commits: 0, prs: 0 };
        }

        timelineMap[key].commits++;
    });

    // Count PRs
    prs.forEach((pr: any) => {
        const key = getMonthKey(pr.createdAt);

        if (!timelineMap[key]) {
            timelineMap[key] = { commits: 0, prs: 0 };
        }

        timelineMap[key].prs++;
    });

    const timeline = Object.entries(timelineMap)
        .map(([month, data]) => ({
            month,
            commits: data.commits,
            prs: data.prs,
        }))
        .sort((a, b) => a.month.localeCompare(b.month));

    // Details
    const details = {
        name: repo.name,
        description: repo.description,
        url: repo.url,
        stars: repo.stargazerCount,
        forks: repo.forkCount,
        createdAt: repo.createdAt,
        updatedAt: repo.updatedAt,
        language: repo.primaryLanguage?.name ?? "Unknown",
        color: repo.primaryLanguage?.color ?? "#94a3b8",
    };

    return {
        details,
        timeline,
    };
}