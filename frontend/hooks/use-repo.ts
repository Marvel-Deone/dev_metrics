import { apiFetch } from "@/lib/api"
import { useEffect, useState } from "react"

export function useRepos(page: number) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true)

      const res = await apiFetch(`/github/repos?page=${page}`)
      const newRepos = await res.json()

      setData(prev => [...prev, ...newRepos])
      setHasMore(newRepos.length > 0)
      setLoading(false)
    }

    fetchRepos()
  }, [page])

  return { data, loading, hasMore }
}