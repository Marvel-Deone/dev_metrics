"use client"

import { useEffect, useState } from "react"

export function useRepoDetails(
  owner?: string,
  repo?: string,
  token?: string
) {
  const [repoDetails, setRepoDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!owner || !repo || !token) return

    const fetchRepo = async () => {
      try {
        setLoading(true)

        const res = await fetch(
          `/api/github/repo?owner=${owner}&repo=${repo}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!res.ok) throw new Error("Failed to fetch repo")

        const data = await res.json()
        console.log('myRepoDetails:', data);
        
        setRepoDetails(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRepo()
  }, [owner, repo, token])

  return { repoDetails, loading, error }
}
