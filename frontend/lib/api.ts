import { signOut } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("backend_token")
      : null;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // global unauthorize logic
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("backend_token");
      // await signOut({ callbackUrl: "/auth/signin" });
    }

    throw new Error("Unauthorized");
  }

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(json?.message || "Something went wrong");
  }

  return json;
}
