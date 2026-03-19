import { Injectable } from '@nestjs/common';
import { GitHubClient } from './github.client';

@Injectable()
export class GithubService {
  constructor(private client: GitHubClient) { }

  async getUserProfile(login: string, token: string) {
    // const query = `
    //   query ($login: String!) {
    //     user(login: $login) {
    //       login
    //       name
    //       bio
    //       avatarUrl
    //       followers { totalCount }

    //       repositories(
    //         first: 20, 
    //         ownerAffiliations: OWNER,
    //         orderBy: { field: PUSHED_AT, direction: DESC }
    //        ) {
    //         nodes {
    //           name
    //           url
    //           isPrivate
    //           stargazerCount
    //           forkCount
    //           updatedAt
    //           pushedAt
    //           languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
    //             edges {
    //               size
    //               node {
    //                 name
    //                 color
    //               }
    //             }
    //           }
    //         }
    //       }

    //       pullRequests(first: 30) {
    //         nodes {
    //           title
    //           createdAt
    //           state
    //           merged
    //           repository { name }
    //         }
    //       }

    //       contributionsCollection {
    //         pullRequestContributions {
    //           totalCount
    //         }
    //       pullRequestReviewContributions {
    //         totalCount
    //       }
    //       contributionCalendar {
    //         weeks {
    //           contributionDays {
    //             date
    //             contributionCount
    //           }
    //         }
    //       }
    //     }
    //     }
    //   }
    // `;
    const query = `
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

        languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
          edges {
            size
            node {
              name
              color
            }
          }
        }

        pullRequests(first: 10, orderBy: { field: CREATED_AT, direction: DESC }) {
          nodes {
            createdAt
            state
            merged
          }
        }
      }
    }

    pullRequests(first: 30) {
      nodes {
        title
        createdAt
        state
        merged
        repository { name }
      }
    }

    contributionsCollection {
      pullRequestContributions {
        totalCount
      }
      pullRequestReviewContributions {
        totalCount
      }
      contributionCalendar {
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
    return this.client.graphql(token, query, { login });
  }
}
