import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    login?: string;
  }

  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      login?: string | null;
    };
  }
}
