// import NextAuth from "next-auth";
// import GitHubProvider from "next-auth/providers/github";

// export const authOptions = {
//   providers: [
//     GitHubProvider({
//       clientId: process.env.GITHUB_CLIENT_ID!,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      // profile(profile, tokens) {
      //   return {
      //     id: String(profile.id),
      //     name: profile.name,
      //     email: profile.email,
      //     image: profile.avatar_url,
      //     login: profile.login,
      //   };
      // }
//     }),
//   ],

//   callbacks: {
//     async session({ session, token }: any) {
//       if (session.user) {
//         session.user.login = token.login as string; // ADD THIS
//       }
//       return session;
//     },
//     async jwt({ token, user }: any) {
//       if (user) {
//         token.login = user.login; // ADD THIS
//       }
//       return token;
//     },
//   },
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };

import NextAuth from "next-auth"
import { authConfig } from "@/auth"

const handler = NextAuth(authConfig)
export { handler as GET, handler as POST }

// import NextAuth from "next-auth";
// import GithubProvider from "next-auth/providers/github";

// const handler = NextAuth({
//   providers: [
//     GithubProvider({
//       clientId: process.env.GITHUB_ID!,
//       clientSecret: process.env.GITHUB_SECRET!,
//     })
//   ],

//   callbacks: {
//     async jwt({ token, account, profile }) {
//       if (account && profile) {
//         console.log("PROFILE FROM GITHUB 👉", profile);
//         console.log("ACCOUNT 👉", account);
//         (token as any).login = (profile as any).login; // 👈 save GitHub username
//       }
//       return token;
//     },

//     async session({ session, token }) {
//       session.user.login = token.login as string; // 👈 attach login to session
//       return session;
//     }
//   }
// });

// export { handler as GET, handler as POST };
