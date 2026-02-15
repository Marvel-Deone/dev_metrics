import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';


const cache = new Map<string, { data: any; expires: number }>();
const TTL = 1000 * 60 * 5;

@Injectable()
export class UsersService {
    constructor(private authService: AuthService) { }

    async getProfile(user: any) {
        console.log('userfff:', user);

        const cacheKey = `profile:${user.login}`;
        const cached = cache.get(cacheKey);

        if (cached && cached.expires > Date.now()) {
            return cached.data;
        }

        const githubToken = this.authService.getGithubToken(user.userId);

        if (!githubToken) {
            throw new UnauthorizedException('GitHub token not found');
        }

        const login = user.login;
        const res = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${githubToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                query ($login: String!) {
                    user(login: $login) {
                    login
                    name
                    bio
                    avatarUrl
                    followers { totalCount }

                    repositories(
                        first: 20, 
                        ownerAffiliations: OWNER,
                        orderBy: { field: PUSHED_AT, direction: DESC }
                    ) {
                    nodes {
                        name
                        url
                        isPrivate
                        stargazerCount
                        forkCount
                        updatedAt
                        pushedAt

                        defaultBranchRef {
                            target {
                                ... on Commit {
                                history(first: 5) {
                                nodes {
                                    committedDate
                                    messageHeadline
                                }
                                    totalCount
                                }
                                }
                            }
                        }

                        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
                        edges {
                            size
                            node { name color }
                        }
                        }

                        pullRequests(last: 14) {
                        nodes {
                            createdAt
                            state
                        }
                        }
                    }
                    }

                    pullRequests(
                    first: 30
                    orderBy: { field: CREATED_AT, direction: DESC }
                    ) {
                    nodes {
                        title
                        url
                        createdAt
                        merged
                        state
                        repository { name }
                    }
                    }

                    contributionsCollection {
                    pullRequestContributions { totalCount }
                    pullRequestReviewContributions { totalCount }
                    contributionCalendar {
                        weeks {
                        contributionDays {
                            date
                            contributionCount
                            color
                        }
                        }
                    }
                    }
                }
            }
        `,
                variables: { login },
            }),
        });

        if (!res.ok) {
            throw new Error('GitHub request failed');
        }


        const json = await res.json();

        if (json.errors) {
            console.error(json.errors);
            throw new Error('GitHub GraphQL error');
        }

        const response = this.buildProfileResponse(json.data.user);

        cache.set(cacheKey, { data: response, expires: Date.now() + TTL });
        return response;
    }

    private buildProfileResponse(user: any) {
        function groupPRsByWeek(prs: any[]) {
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

        // Compute trend: (lastWeek - prevWeek) / prevWeek
        function calculateTrend(repoPRs: any[]) {
            const weeks = groupPRsByWeek(repoPRs);
            if (weeks.length < 2) return "+0%";

            const lastWeekCommits = weeks[weeks.length - 1].opened || 0;
            const prevWeekCommits = weeks[weeks.length - 2].opened || 0;

            if (prevWeekCommits === 0) return "+0%";

            const trend = ((lastWeekCommits - prevWeekCommits) / prevWeekCommits) * 100;
            return `${trend >= 0 ? "+" : ""}${trend.toFixed(0)}%`;
        }

        function groupActivityByHour(commits: any[], prs: any[]) {
            const hours = Array.from({ length: 24 }, (_, h) => ({
                hour: h,
                count: 0,
            }))

            commits.forEach((c) => {
                const hour = new Date(c.committedDate).getHours()
                hours[hour].count++
            })

            prs.forEach((pr) => {
                const hour = new Date(pr.createdAt).getHours()
                hours[hour].count++
            })

            return hours
        }

        const recentActivity: any[] = []

        // Aggregate languages
        const languageTotals: Record<string, { size: number; color?: string }> = {};
        user.repositories.nodes.forEach((repo: any) => {
            repo.languages.edges.forEach((edge: any) => {
                const name = edge.node.name;
                if (!languageTotals[name]) languageTotals[name] = { size: 0, color: edge.node.color };
                languageTotals[name].size += edge.size;
            });
        });

        const totalSize = Object.values(languageTotals).reduce((sum, lang) => sum + lang.size, 0);

        const languages = Object.entries(languageTotals)
            .map(([language, data]) => ({
                language,
                percentage: Number(((data.size / totalSize) * 100).toFixed(2)),
                color: data.color ?? "#94a3b8",
            }))
            .sort((a, b) => b.percentage - a.percentage);

        // PR stats
        const prStats = {
            totalAuthored: user.contributionsCollection.pullRequestContributions.totalCount,
            totalReviewed: user.contributionsCollection.pullRequestReviewContributions.totalCount,
        };

        const prWeeklyActivity = groupPRsByWeek(user.pullRequests.nodes);
        const contributions = user.contributionsCollection.contributionCalendar.weeks.flatMap(
            (w: any) => w.contributionDays
        );

        // Active Repos with trend
        const activeRepos = user.repositories.nodes
            .slice(0, 5)
            .map((repo: any) => ({
                name: repo.name,
                url: repo.url,
                stars: repo.stargazerCount,
                forks: repo.forkCount,
                commits: repo.defaultBranchRef?.target?.history?.totalCount ?? 0,
                language: repo.languages.edges[0]?.node.name ?? "Unknown",
                color: repo.languages.edges[0]?.node.color ?? "#94a3b8",
                updatedAt: repo.updatedAt,
                trend: calculateTrend(repo.pullRequests.nodes),
            }));

        const allCommits: any[] = []

        user.repositories.nodes.forEach((repo: any) => {
            const commits = repo.defaultBranchRef?.target?.history?.nodes ?? []
            commits.forEach((c: any) => {
                allCommits.push(c)
            })
        })

        const { commitTrends, totalCommits7Days } = calculateCommitTrends(allCommits);

        const allPRs = user.pullRequests.nodes
        // Compute active hours
        const activeHours = groupActivityByHour(allCommits, allPRs)

        const peakHour = activeHours.reduce(
            (max, h) => (h.count > max.count ? h : max),
            activeHours[0]
        )

        const mostActiveHour = {
            hour: peakHour.hour,
            count: peakHour.count,
        }
        // Recent Activity

        // PRs
        user.pullRequests.nodes.forEach((pr: any) => {
            recentActivity.push({
                type: "pr",
                repo: pr.repository.name,
                message: pr.title,
                date: pr.createdAt,
            })
        })

        // Commits
        user.repositories.nodes.forEach((repo: any) => {
            const commits = repo.defaultBranchRef?.target?.history?.nodes ?? []

            commits.forEach((commit: any) => {
                recentActivity.push({
                    type: "commit",
                    repo: repo.name,
                    message: commit.messageHeadline,
                    date: commit.committedDate,
                })
            })
        })

        // Sort + limit
        recentActivity.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )

        const recentActivityLimited = recentActivity.slice(0, 5)

        function calculateCommitTrends(commits: any[]) {
            const days = [...Array(7)].map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                return d.toLocaleDateString("en-US", { weekday: "short" });
            });

            const map: Record<string, number> = {};
            days.forEach((d) => (map[d] = 0));

            commits.forEach((commit) => {
                const day = new Date(commit.committedDate).toLocaleDateString(
                    "en-US",
                    { weekday: "short" }
                );

                if (day in map) {
                    map[day]++;
                }
            });

            const trends = Object.entries(map).map(([day, commits]) => ({
                day,
                commits,
            }));

            const total = trends.reduce((sum, d) => sum + d.commits, 0);

            return {
                commitTrends: trends,
                totalCommits7Days: total,
            };
        }

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
            pullRequests: prStats.totalAuthored,
            prActivity: {
                ...prStats,
                weekly: prWeeklyActivity,
            },

            activeHours,
            mostActiveHour,
            recentActivity: recentActivityLimited,
            contributions,
            commitTrends,
            totalCommits7Days
        };
    }
}
