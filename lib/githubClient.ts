export async function githubGraphQL<T>(query: string, variables?: Record<string, any>): Promise<T> {
    const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
        },
        body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();
    if (json.errors) {
        throw new Error("GitHub GraphQL Error");
    }
s
    return json.data as T;
}
