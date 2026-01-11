// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// export async function GET() {
//     const session = await getServerSession(authOptions);
//     const languageMap: Record<string, number> = {};

//     if (!session?.githubToken || !session.login) {
//         return NextResponse.json(
//             { error: "Unauthorized" },
//             { status: 401 }
//         );
//     }

//     const res = await fetch("https://api.github.com/graphql", {
//         method: "POST",
//         headers: {
//             Authorization: `Bearer ${session.githubToken}`,
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             query: `
//         query ($login: String!) {
//           user(login: $login) {
//             login
//             name
//             bio
//             avatarUrl
//             followers { totalCount }
//             repositories(first: 20, ownerAffiliations: OWNER) {
//               nodes {
//                 name
//                 url
//                 isPrivate
//                 languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
//                     edges {
//                         size
//                         node {
//                         name
//                         }
//                     }
//                     }
//                 stargazerCount
//                 forkCount
//                 updatedAt
//               }
//             }
//             contributionsCollection(from: $from, to: $to) {
//               pullRequestContributions { totalCount }
//                pullRequestContributionsByRepository {
//                     contributions { totalCount }
//                 }
//               contributionCalendar {
//                 totalContributions
//                 weeks {
//                   contributionDays {
//                     date
//                     contributionCount
//                     color
//                   }
//                 }
//               }
//             }
//           }
//         }
//       `,
//             variables: { login: session.login },
//         }),
//     });

//     if (!res.ok) {
//         return NextResponse.json(
//             { error: "GitHub request failed" },
//             { status: 401 }
//         );
//     }

//     const json = await res.json();
//     const user = json.data.user;

//     // Language Heatmap
//     user.repositories.nodes.forEach((repo: any) => {
//         repo.languages.edges.forEach((edge: any) => {
//             const lang = edge.node.name;
//             languageMap[lang] = (languageMap[lang] || 0) + edge.size;
//         });
//     });

//     const totalSize = Object.values(languageMap).reduce((a, b) => a + b, 0);

//     const languages = Object.entries(languageMap).map(([language, size]) => ({
//         language,
//         percentage: Math.round((size / totalSize) * 100),
//     }));

//     // PR Activity
//     const contributions =
//         user.contributionsCollection.contributionCalendar.weeks.flatMap(
//             (week: any) =>
//                 week.contributionDays.map((day: any) => ({
//                     date: day.date,
//                     count: day.contributionCount,
//                     color: day.color,
//                 }))
//         );


//     return NextResponse.json({
//     user: {
//         login: user.login,
//         name: user.name,
//         bio: user.bio,
//         avatarUrl: user.avatarUrl,
//         followers: user.followers.totalCount,
//     },
//     repos: user.repositories.nodes,
//     languages,
//     pullRequests:
//         user.contributionsCollection.pullRequestContributions.totalCount,
//     contributions,
//     // contributions:
//     //     user.contributionsCollection.contributionCalendar.weeks.flatMap(
//     //         (w: any) => w.contributionDays
//     //     ),
// });
// }



// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// const cache = new Map<string, { data: any; expires: number }>()
// const TTL = 1000 * 60 * 5 // 5 minutes


// function groupPRsByWeek(prs: any[]) {
//     const weeks: Record<string, any> = {}

//     prs.forEach(pr => {
//         const date = new Date(pr.createdAt)
//         const week = `W${Math.ceil(date.getDate() / 7)}`

//         if (!weeks[week]) {
//             weeks[week] = { week, opened: 0, merged: 0, closed: 0 }
//         }

//         weeks[week].opened++

//         if (pr.state === "MERGED") weeks[week].merged++
//         if (pr.state === "CLOSED" && !pr.merged) weeks[week].closed++
//     })

//     return Object.values(weeks)
// }

// export async function GET() {
//     const session = await getServerSession(authOptions);

//     console.log("PROFILE SESSION:", session);

//     const githubToken = session?.githubToken;
//     const login = (session?.user as any)?.login;

//     if (!githubToken || !login) {
//         return NextResponse.json(
//             { error: "Unauthorized" },
//             { status: 401 }
//         );
//     }

//     const cacheKey = `profile:${login}`
//     const cached = cache.get(cacheKey)

//     if (cached && cached.expires > Date.now()) {
//         console.log("CACHE HIT")
//         return NextResponse.json(cached.data)
//     }

//     console.log("CACHE MISS")

//     const res = await fetch("https://api.github.com/graphql", {
//         method: "POST",
//         headers: {
//             Authorization: `Bearer ${githubToken}`,
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             query: `
//         query ($login: String!) {
//           user(login: $login) {
//             login
//             name
//             bio
//             avatarUrl
//             followers { totalCount }

//             repositories(first: 20, ownerAffiliations: OWNER) {
//               nodes {
//                 name
//                 url
//                 isPrivate
//                 stargazerCount
//                 forkCount
//                 updatedAt
//                 languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
//                   edges {
//                     size
//                     node { name color }
//                   }
//                 }
//               }
//             }

//             pullRequests(
//               first: 30
//               orderBy: { field: CREATED_AT, direction: DESC }
//             ) {
//               nodes {
//                 title
//                 url
//                 createdAt
//                 merged
//                 state
//                 repository { name }
//               }
//             }

//             contributionsCollection {
//               pullRequestContributions { totalCount }
//               pullRequestReviewContributions { totalCount }
//               contributionCalendar {
//                 weeks {
//                   contributionDays {
//                     date
//                     contributionCount
//                     color
//                   }
//                 }
//               }
//             }
//           }
//         }
//       `,
//             variables: { login },
//         }),
//     })

//     if (!res.ok) {
//         console.error("GitHub API failed:", res.status)
//         return NextResponse.json({ error: "GitHub request failed" }, { status: 500 })
//     }

//     const json = await res.json()
//     const user = json.data.user

//     // Languages
//     const languageTotals: Record<string, { size: number; color?: string }> = {}

//     user.repositories.nodes.forEach((repo: any) => {
//         repo.languages.edges.forEach((edge: any) => {
//             const name = edge.node.name
//             if (!languageTotals[name]) {
//                 languageTotals[name] = { size: 0, color: edge.node.color }
//             }
//             languageTotals[name].size += edge.size
//         })
//     })

//     const totalSize = Object.values(languageTotals).reduce((a, b) => a + b.size, 0)

//     const languages = Object.entries(languageTotals)
//         .map(([language, data]) => ({
//             language,
//             percentage: Number(((data.size / totalSize) * 100).toFixed(2)),
//             color: data.color ?? "#94a3b8",
//         }))
//         .sort((a, b) => b.percentage - a.percentage)

//     // PRActivity
//     const prStats = {
//         totalAuthored:
//             user.contributionsCollection.pullRequestContributions.totalCount,
//         totalReviewed:
//             user.contributionsCollection.pullRequestReviewContributions.totalCount,
//     }

//     const prWeeklyActivity = groupPRsByWeek(user.pullRequests.nodes)

//     // Contributions
//     const contributions =
//         user.contributionsCollection.contributionCalendar.weeks.flatMap(
//             (w: any) => w.contributionDays
//         )

//     // Active Repos
//     const activeRepos = user.repositories.nodes
//         .filter((repo: any) => !repo.isPrivate) // optional, only public repos
//         .sort(
//             (a: any, b: any) =>
//                 new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
//         )
//         .slice(0, 5) // top 5 active
//         .map((repo: any) => ({
//             name: repo.name,
//             url: repo.url,
//             stars: repo.stargazerCount,
//             forks: repo.forkCount,
//             language:
//                 repo.languages.edges[0]?.node.name ?? "Unknown",
//             color: repo.languages.edges[0]?.node.color ?? "#94a3b8",
//             updatedAt: repo.updatedAt,
//             trend =
//         prevWeekCommits
//             ? `+${(((lastWeekCommits - prevWeekCommits) / prevWeekCommits) * 100).toFixed(0)}%`
//             : "+0%"
//         }))

//     const response = {
//         user: {
//             login: user.login,
//             name: user.name,
//             bio: user.bio,
//             avatarUrl: user.avatarUrl,
//             followers: user.followers.totalCount,
//         },

//         repos: user.repositories.nodes,

//         activeRepos,

//         languages,

//         pullRequests:
//             user.contributionsCollection.pullRequestContributions.totalCount,

//         prActivity: {
//             ...prStats,
//             weekly: prWeeklyActivity,
//         },

//         contributions,
//     }

//     cache.set(cacheKey, {
//         data: response,
//         expires: Date.now() + TTL,
//     })

//     return NextResponse.json(response)

// }

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const cache = new Map<string, { data: any; expires: number }>();
const TTL = 1000 * 60 * 5; // 5 minutes

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

export async function GET() {
    const session = await getServerSession(authOptions);

    const githubToken = session?.githubToken;
    const login = (session?.user as any)?.login;

    if (!githubToken || !login) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cacheKey = `profile:${login}`;
    const cached = cache.get(cacheKey);

    if (cached && cached.expires > Date.now()) {
        return NextResponse.json(cached.data);
    }

    const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${githubToken}`,
            "Content-Type": "application/json",
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

                repositories(first: 20, ownerAffiliations: OWNER) {
                  nodes {
                    name
                    url
                    isPrivate
                    stargazerCount
                    forkCount
                    updatedAt
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
        console.error("GitHub API failed:", res.status);
        return NextResponse.json({ error: "GitHub request failed" }, { status: 500 });
    }

    const json = await res.json();
    const user = json.data.user;

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
        .filter((repo: any) => !repo.isPrivate)
        .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5)
        .map((repo: any) => ({
            name: repo.name,
            url: repo.url,
            stars: repo.stargazerCount,
            forks: repo.forkCount,
            language: repo.languages.edges[0]?.node.name ?? "Unknown",
            color: repo.languages.edges[0]?.node.color ?? "#94a3b8",
            updatedAt: repo.updatedAt,
            trend: calculateTrend(repo.pullRequests.nodes),
        }));

    const response = {
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

        contributions,
    };

    cache.set(cacheKey, { data: response, expires: Date.now() + TTL });
    return NextResponse.json(response);
}
