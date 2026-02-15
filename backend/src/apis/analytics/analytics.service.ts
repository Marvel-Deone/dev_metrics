import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AnalyticsService {
    constructor(private authService: AuthService) { }

    async getOverview(user: any) {
        const githubToken = this.authService.getGithubToken(user.userId);

        if (!githubToken) {
            throw new UnauthorizedException('GitHub token not found');
        }

        const query = `
      query {
        viewer {
          contributionsCollection {
            totalCommitContributions
            totalPullRequestContributions
            totalPullRequestReviewContributions
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }
    `;

        try {
            const res = await fetch("https://api.github.com/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${githubToken}`,
                },
                body: JSON.stringify({ query }),
            });

            const json = await res.json();

            if (!res.ok || json.errors) {
                throw new InternalServerErrorException({
                    message: "GitHub GraphQL error",
                    details: json.errors,
                });
            }

            const contrib = json.data.viewer.contributionsCollection;

            const days = contrib.contributionCalendar.weeks
                .flatMap((week: any) => week.contributionDays);

            // 🔥 Calculate streak
            let streak = 0;
            for (let i = days.length - 1; i >= 0; i--) {
                if (days[i].contributionCount > 0) streak++;
                else break;
            }

            // 🔥 Best streak
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

            return {
                commits: contrib.totalCommitContributions,
                prs: contrib.totalPullRequestContributions,
                reviews: contrib.totalPullRequestReviewContributions,
                streak,
                bestStreak: best,
            };

        } catch (err) {
            throw new InternalServerErrorException("Failed to fetch analytics");
        }
    }
}
