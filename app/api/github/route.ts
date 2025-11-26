import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
  });

  const data = await res.json();
  return NextResponse.json({ data });
}