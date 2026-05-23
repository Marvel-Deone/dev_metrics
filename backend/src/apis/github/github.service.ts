import { Injectable } from '@nestjs/common';
import { GitHubClient } from './github.client';

@Injectable()
export class GithubService {
  constructor(private client: GitHubClient) { }

  async getUserRepos(
    login: string,
    token: string,
    first = 20,
    after?: string
  ) {
    const query = `
    query ($login: String!, $first: Int!, $after: String) {
      user(login: $login) {
        repositories(
          first: $first
          after: $after
          ownerAffiliations: OWNER
          orderBy: { field: PUSHED_AT, direction: DESC }
        ) {
          totalCount
          pageInfo {
            hasNextPage
            endCursor
          }
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 0) {
                  totalCount
                }
              }
            }
        }
          nodes {
            id
            name
            url
            isPrivate
            stargazerCount
            forkCount
            pushedAt
            updatedAt

            primaryLanguage {
              name
              color
            }
          }
        }
      }
    }
  `;

    return this.client.graphql(token, query, {
      login,
      first,
      after,
    });
  }

  async getUserProfile(login: string, token: string) {
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
    }`;
    return this.client.graphql(token, query, { login });
  }

  async getRepoProfile(owner: string, name: string, token: string) {
    const query = `
    query ($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        name
        description
        url
        stargazerCount
        forkCount
        createdAt
        updatedAt

        primaryLanguage {
          name
          color
        }

        defaultBranchRef {
          target {
            ... on Commit {
              history(first: 100) {
                nodes {
                  committedDate
                }
              }
            }
          }
        }

        pullRequests(first: 100) {
          nodes {
            createdAt
          }
        }
      }
    }
  `;

    return this.client.graphql(token, query, { owner, name });
  }
}
