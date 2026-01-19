import { NextResponse } from "next/server";

function startOfMonthUTC(d: Date) {
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

function addMonthsUTC(d: Date, n: number) {
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1));
}

function monthLabel(d: Date) {
    return new Intl.DateTimeFormat("en", { month: "short" }).format(d);
}

function day(d: Date) {
    return d.toISOString().slice(0, 10);
}

// export async function GET(
//   req: Request,
//   { params }: { params: { owner: string; repo: string } }
// ) {
//   const auth = req.headers.get("authorization");
//   const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

//   if (!token) {
//     return NextResponse.json({ message: "Missing token" }, { status: 401 });
//   }

//   const { owner, repo } = params;
export async function GET(
    req: Request,
    context: { params:  Promise<{ owner?: string; repo?: string }> }
) {
    const auth = req.headers.get("authorization");
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

    if (!token) {
        return NextResponse.json({ message: "Missing token" }, { status: 401 });
    }

    const { owner, repo } = await context.params;
    // const repo = context.params?.repo;

    if (!owner || !repo) {
        return NextResponse.json(
            { message: "Missing owner/repo params", details: { owner, repo } },
            { status: 400 }
        );
    }
    const now = new Date();
    const base = startOfMonthUTC(now);

    const months = Array.from({ length: 6 }).map((_, i) => {
        const start = addMonthsUTC(base, i - 5);
        const end = addMonthsUTC(start, 1);
        return {
            label: monthLabel(start),
            since: start.toISOString(),
            until: end.toISOString(),
            sinceDay: day(start),
            untilDay: day(end),
        };
    });

    const commitAliases = months
        .map(
            (m, i) => `
      c${i}: history(since: "${m.since}", until: "${m.until}") {
        totalCount
      }
    `
        )
        .join("\n");

    const prAliases = months
        .map(
            (m, i) => `
      p${i}: search(
        query: "repo:${owner}/${repo} is:pr created:>=${m.sinceDay} created:<${m.untilDay}",
        type: ISSUE,
        first: 1
      ) { issueCount }
    `
        )
        .join("\n");

    const query = `
    query {
      repository(owner: "${owner}", name: "${repo}") {
        defaultBranchRef {
          target {
            ... on Commit {
              ${commitAliases}
            }
          }
        }
      }
      ${prAliases}
    }
  `;

    const ghRes = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
        cache: "no-store",
    });

    const json = await ghRes.json();

    if (!ghRes.ok || json.errors) {
        return NextResponse.json(
            { message: "GitHub GraphQL error", details: json.errors },
            { status: 500 }
        );
    }

    const history = json.data.repository.defaultBranchRef?.target;

    const timeline = months.map((m, i) => ({
        month: m.label,
        commits: history?.[`c${i}`]?.totalCount ?? 0,
        prs: json.data[`p${i}`]?.issueCount ?? 0,
    }));

    return NextResponse.json({ timeline });
}
