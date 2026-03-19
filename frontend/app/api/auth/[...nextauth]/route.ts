import NextAuth, { type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

declare module "next-auth" {
  interface Session {
    githubToken?: string;
    login?: string;
    backendToken?: string;
    onboardingCompleted?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    githubToken?: string;
    login?: string;
    backendToken?: string;
    onboardingCompleted?: boolean;
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
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // async jwt({ token, account }) {
    //   console.log('Hi, I got here, this is account: ', account, 'token:', token);

    //   if (account?.access_token) {
    //     console.log("GitHub access token exists");

    //     const res = await fetch(
    //       `${process.env.NEXT_PUBLIC_API_URL}/auth/github`,
    //       {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({
    //           githubToken: account.access_token,
    //         }),
    //       }
    //     );

    //     console.log('callbackRes:', res);

    //     const data = await res.json();
    //     console.log('callbackData:', data);

    //     token.githubToken = account.access_token;
    //     token.backendToken = data.accessToken;
    //     token.onboardingCompleted = data.onboardingCompleted;

    //     // const res = await fetch(
    //     //   `${process.env.NEXT_PUBLIC_API_URL}/auth/github`,
    //     //   {
    //     //     method: "POST",
    //     //     headers: { "Content-Type": "application/json" },
    //     //     body: JSON.stringify({
    //     //       githubToken: account.access_token,
    //     //     }),
    //     //   }
    //     // );
    //     // console.log('ddffRe:', res);

    //     // const data = await res.json();

    //     // console.log("NEST RESPONSE:", data);

    //     // token.githubToken = account.access_token;
    //     // token.backendToken = data.accessToken;
    //     // token.onboardingCompleted = data.onboardingCompleted;
    //   }

    //   return token;
    // },
    async jwt({ token, account }) {
      if (account?.access_token && !token.backendToken) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/github`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            githubToken: account.access_token,
          }),
        });

        const data = await res.json();

        token.githubToken = account.access_token;
        token.backendToken = data.accessToken;
        token.onboardingCompleted = data.onboardingCompleted;
      }

      return token;
    },

    async session({ session, token }) {
      session.githubToken = token.githubToken as string;
      session.backendToken = token.backendToken as string;
      session.onboardingCompleted = token.onboardingCompleted as boolean;

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
