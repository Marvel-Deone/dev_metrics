import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  const auth = req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!owner || !repo) {
    return NextResponse.json({ message: "Missing owner/repo" }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json({ message: "Missing token" }, { status: 401 });
  }

  const ghRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });

  const data = await ghRes.json().catch(() => null);

  if (!ghRes.ok) {
    return NextResponse.json(
      { message: data?.message || "GitHub error", details: data },
      { status: ghRes.status }
    );
  }

  return NextResponse.json(data);
}
