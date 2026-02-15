import { NextAuthOptions } from "next-auth"
import GitHub from "next-auth/providers/github"

export const authConfig = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile(profile, tokens) {
        return {
          id: String(profile.id),
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
          login: profile.login,
        };
      },
      authorization: {
        params: {
          scope: "read:user user:email repo"
        }
      }
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (profile) {
        (token as any).login = (profile as any).login;
      }

      if (account) {
        (token as any).accessToken = account.access_token;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        login: (token as any).login ?? null,
      };

      (session as any).accessToken = (token as any).accessToken;

      return session;
    },
  },
} satisfies NextAuthOptions
