import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ReposService {
  constructor(private authService: AuthService) { }

  async getRepoProfile(user: any, owner: string, repo: string) {
    const githubToken = this.authService.getGithubToken(user.userId);

    if (!githubToken) {
      throw new UnauthorizedException('GitHub token not found');
    }

    /* Fetch Repo Details (REST) */

    const repoRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );

    const repoJson = await repoRes.json().catch(() => null);

    if (!repoRes.ok) {
      throw new InternalServerErrorException({
        message: repoJson?.message || 'GitHub repo fetch failed',
        details: repoJson,
      });
    }

    /* Build Timeline (GraphQL) */

    function startOfMonthUTC(d: Date) {
      return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
    }

    function addMonthsUTC(d: Date, n: number) {
      return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1));
    }

    function monthLabel(d: Date) {
      return new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
    }

    function day(d: Date) {
      return d.toISOString().slice(0, 10);
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
      `,
      )
      .join('\n');

    const prAliases = months
      .map(
        (m, i) => `
        p${i}: search(
          query: "repo:${owner}/${repo} is:pr created:>=${m.sinceDay} created:<${m.untilDay}",
          type: ISSUE,
          first: 1
        ) { issueCount }
      `,
      )
      .join('\n');

    const gqlQuery = `
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

    const timelineRes = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: gqlQuery }),
    });

    const timelineJson = await timelineRes.json();

    if (!timelineRes.ok || timelineJson.errors) {
      throw new InternalServerErrorException({
        message: 'GitHub timeline fetch failed',
        details: timelineJson.errors,
      });
    }

    const history =
      timelineJson.data.repository.defaultBranchRef?.target;

    const timeline = months.map((m, i) => ({
      month: m.label,
      commits: history?.[`c${i}`]?.totalCount ?? 0,
      prs: timelineJson.data[`p${i}`]?.issueCount ?? 0,
    }));

    return {
      details: repoJson,
      timeline,
    };
  }
}