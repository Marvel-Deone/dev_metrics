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
            accessToken?: string | null;
            githubToken?: string | null;
            login?: string | null;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string
    }
}
