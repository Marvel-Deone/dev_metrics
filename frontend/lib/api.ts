import { signOut } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { getSession } from "next-auth/react";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const session = await getSession();
  console.log("FULL SESSION:", session);

  const token = session?.backendToken;
  console.log("BACKEND TOKEN:", token);

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



// [Nest] 10032  - 11/03/2026, 17:54:46     LOG [NestApplication] Nest application successfully started +34115ms
// prisma:error 
// Invalid `this.prisma.user.upsert()` invocation in 
// C:\Users\Dev Coder\Documents\mine\dev_metrics\backend\src\apis\users\users.service.ts:457:49        

//   454     updateData.email = email;
//   455 }
//   456
// → 457 const user = await this.prisma.user.upsert( 
// The column `(not available)` does not exist in the current database.
// prisma:error 
// Invalid `this.prisma.user.upsert()` invocation in 
// C:\Users\Dev Coder\Documents\mine\dev_metrics\backend\src\apis\users\users.service.ts:457:49        

//   454     updateData.email = email;
//   455 }
//   456
// → 457 const user = await this.prisma.user.upsert( 
// The column `(not available)` does not exist in the current database.
// ^CTerminate batch job (Y/N)? 
// ^C