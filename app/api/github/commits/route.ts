import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  console.log("API /commits session:", session);

  if (!session?.githubUsername) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const res = await fetch(
    `https://api.github.com/users/${session.githubUsername}/events/public?per_page=100`,
    {
      headers: {
        Authorization: `Bearer ${session.githubToken}`,
      },
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "GitHub events failed" },
      { status: res.status }
    );
  }

  const events = await res.json();

  const days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString("en-US", { weekday: "short" });
  });

  const map: Record<string, number> = {};
  days.forEach(d => (map[d] = 0));

  events.forEach((e: any) => {
    if (e.type === "PushEvent") {
      const day = new Date(e.created_at)
        .toLocaleDateString("en-US", { weekday: "short" });
      map[day] += e.payload?.commits?.length || 1;
    }
  });

  const trends = Object.entries(map).map(([day, commits]) => ({
    day,
    commits,
  }));

  const total = trends.reduce((s, d) => s + d.commits, 0);

  return NextResponse.json({ trends, total });
}
