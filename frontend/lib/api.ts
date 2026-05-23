import { signOut } from "next-auth/react";

import { getSession } from "next-auth/react";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const session = await getSession();

  const token = session?.backendToken;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(json?.message || "Something went wrong");
  }

  return json;
}