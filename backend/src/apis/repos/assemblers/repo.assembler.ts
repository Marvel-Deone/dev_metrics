export function buildReposResponse(data: any) {
  const repoConnection = data?.user?.repositories;

  if (!repoConnection) return null;

  const { nodes, pageInfo, totalCount } = repoConnection;

  const repos = nodes.map((repo: any) => ({
    id: repo.id,
    name: repo.name,
    url: repo.url,
    isPrivate: repo.isPrivate,

    // consistent naming with frontend
    description: repo.description ?? null,
    language: repo.primaryLanguage?.name ?? null,
    languageColor: repo.primaryLanguage?.color ?? null,

    stargazerCount: repo.stargazerCount,
    forkCount: repo.forkCount,

    pushedAt: repo.pushedAt,
    updatedAt: repo.updatedAt,
  }));

  return {
    repos,
    nextCursor: pageInfo.endCursor,
    hasMore: pageInfo.hasNextPage,
    totalCount,
  };
}