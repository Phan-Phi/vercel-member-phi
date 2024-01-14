import NextAuth, { DefaultProfile } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultProfile {
    user: {
      token: string;
      refresh_token_expire: boolean;
    };
  }

  interface JWT {
    token: string;
    refresh_token: string;
    csrf_token: string;
    refresh_token_expire: boolean;
  }

  interface User {
    token?: string;
  }
}
