"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function useBackendAuth() {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status !== "authenticated") return;
        async function exchangeToken() {

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/github`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        githubToken: session?.githubToken,
                    }),
                }
            );

            const { accessToken } = await res.json();

            localStorage.setItem("backend_token", accessToken);
        }

        exchangeToken();
    }, [status, session]);
}
