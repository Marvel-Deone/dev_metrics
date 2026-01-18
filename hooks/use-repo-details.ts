// "use client"

import { useEffect, useState } from "react"

// export function useRepoDetails(
//   owner?: string,
//   repo?: string,
//   token?: string
// ) {
//   const [repoDetails, setRepoDetails] = useState<any>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     if (!owner || !repo || !token) return

//     const fetchRepo = async () => {
//       try {
//         setLoading(true)

//         const res = await fetch(
//           `/api/github/repo?owner=${owner}&repo=${repo}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         )

//         if (!res.ok) throw new Error("Failed to fetch repo")

//         const data = await res.json()
//         console.log('myRepoDetails:', data);
        
//         setRepoDetails(data)
//       } catch (err: any) {
//         setError(err.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchRepo()
//   }, [owner, repo, token])

//   return { repoDetails, loading, error }
// }

// export function useRepoDetails(owner?: string, repo?: string, token?: string) {
//   const [repoDetails, setRepoDetails] = useState<any>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     setError(null)

//     if (!owner || !repo || !token) {
//       setLoading(false)
//       setRepoDetails(null)
//       return
//     }

//     const fetchRepo = async () => {
//       try {
//         setLoading(true)

//         const res = await fetch(
//           `/api/github/repo?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         )

//         const json = await res.json().catch(() => null)

//         if (!res.ok) throw new Error(json?.message || "Failed to fetch repo")

//         setRepoDetails(json)
//       } catch (err: any) {
//         setRepoDetails(null)
//         setError(err.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchRepo()
//   }, [owner, repo, token])

//   return { repoDetails, loading, error }
// }

export function useRepoDetails(owner?: string, repo?: string, token?: string) {
  const [repoDetails, setRepoDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);

    const ready = Boolean(owner && repo && token);

    // ✅ don't declare "not found" state yet; just idle
    if (!ready) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/github/repo?owner=${encodeURIComponent(owner!)}&repo=${encodeURIComponent(repo!)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        );

        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(json?.message || "Failed to fetch repo");

        setRepoDetails(json);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setRepoDetails(null);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [owner, repo, token]);

  return { repoDetails, loading, error };
}
