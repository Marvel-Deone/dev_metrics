import NextAuth, { type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

declare module "next-auth" {
  interface Session {
    githubToken?: string;
    login?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    githubToken?: string;
    login?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.githubToken = account.access_token;
        token.login = (profile as any).login;
      }
      return token;
    },

    async session({ session, token }) {
      session.githubToken = token.githubToken as string;

      if (session.user) {
        (session.user as any).login = token.login as string;
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
