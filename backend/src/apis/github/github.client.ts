export class GitHubClient {
  async graphql<T>(token: string, query: string, variables?: any): Promise<T> {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    const data = await res.json();

    if (!res.ok || data.errors) {
      console.error("GitHub GraphQL response:", data);
      throw new Error("GitHub GraphQL error");
    }

    return data.data;
  }
}
