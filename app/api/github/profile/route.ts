import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    const session = await getServerSession(authOptions);
    const languageMap: Record<string, number> = {};

    if (!session?.githubToken || !session.githubUsername) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${session.githubToken}`,
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
                languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
                    edges {
                        size
                        node {
                        name
                        }
                    }
                    }
                stargazerCount
                forkCount
                updatedAt
              }
            }
            contributionsCollection(from: $from, to: $to) {
              pullRequestContributions { totalCount }
               pullRequestContributionsByRepository {
                    contributions { totalCount }
                }
              contributionCalendar {
                totalContributions
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
            variables: { login: session.githubUsername },
        }),
    });

    if (!res.ok) {
        return NextResponse.json(
            { error: "GitHub request failed" },
            { status: 401 }
        );
    }

    const json = await res.json();
    const user = json.data.user;
    
    // Language Heatmap
    user.repositories.nodes.forEach((repo: any) => {
        repo.languages.edges.forEach((edge: any) => {
            const lang = edge.node.name;
            languageMap[lang] = (languageMap[lang] || 0) + edge.size;
        });
    });

    const totalSize = Object.values(languageMap).reduce((a, b) => a + b, 0);

    const languages = Object.entries(languageMap).map(([language, size]) => ({
        language,
        percentage: Math.round((size / totalSize) * 100),
    }));

    // PR Activity
    const contributions =
        user.contributionsCollection.contributionCalendar.weeks.flatMap(
            (week: any) =>
                week.contributionDays.map((day: any) => ({
                    date: day.date,
                    count: day.contributionCount,
                    color: day.color,
                }))
        );


    return NextResponse.json({
        user: {
            login: user.login,
            name: user.name,
            bio: user.bio,
            avatarUrl: user.avatarUrl,
            followers: user.followers.totalCount,
        },
        repos: user.repositories.nodes,
        languages,
        pullRequests:
            user.contributionsCollection.pullRequestContributions.totalCount,
        contributions,
        // contributions:
        //     user.contributionsCollection.contributionCalendar.weeks.flatMap(
        //         (w: any) => w.contributionDays
        //     ),
    });
}
