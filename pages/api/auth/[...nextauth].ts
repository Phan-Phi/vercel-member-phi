import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import axios from "axios.config";

import get from "lodash/get";
import set from "lodash/set";

import originalAxios from "axios";

import { LOGIN, REFRESH_TOKEN } from "apis";

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: "sign-in",
      credentials: {},
      async authorize(credentials, req) {
        try {
          const username = get(credentials, "username");
          const password = get(credentials, "password");

          const { data } = await axios.post(LOGIN, {
            username: username,
            password,
          });

          return {
            ...data,
            email: username,
            refresh_token_expire: false,
          };
        } catch (err) {
          return null;
        }
      },
    }),
    CredentialsProvider({
      id: "refresh-token",
      credentials: {},
      async authorize(credentials) {
        const refreshTokenExpire: boolean = get(credentials, "refresh_token_expire");
        const refreshToken: string = get(credentials, "refresh_token");
        const csrfToken: string = get(credentials, "csrf_token");
        const email: string = get(credentials, "email");
        const token: string = get(credentials, "token");

        try {
          if (refreshToken && csrfToken) {
            const { data } = await axios.post<{ token: string }>(REFRESH_TOKEN, {
              refresh_token: refreshToken,
              csrf_token: csrfToken,
            });

            return {
              email,
              csrf_token: csrfToken,
              refresh_token: refreshToken,
              token: data.token,
              refresh_token_expire: refreshTokenExpire,
            };
          } else {
            return {
              token,
              email,
              csrf_token: csrfToken,
              refresh_token: refreshToken,
              refresh_token_expire: refreshTokenExpire,
            };
          }
        } catch (err) {
          if (originalAxios.isAxiosError(err)) {
            const statusCode = err.response?.status;

            if (statusCode === 401) {
              return {
                token,
                email,
                refresh_token: null,
                csrf_token: null,
                refresh_token_expire: true,
              };
            }
          }

          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      const token = get(user, "token");

      if (token) {
        return true;
      } else {
        return false;
      }
    },

    async jwt({ token, user }) {
      const _token = get(user, "token");
      const csrf_token = get(user, "csrf_token");
      const refresh_token = get(user, "refresh_token");
      const refresh_token_expire = get(user, "refresh_token_expire");

      if (_token) {
        set(token, "token", _token);
      }

      if (refresh_token) {
        set(token, "refresh_token", refresh_token);
      }

      if (csrf_token) {
        set(token, "csrf_token", csrf_token);
      }

      if (refresh_token_expire != undefined) {
        set(token, "refresh_token_expire", refresh_token_expire);
      }

      return token;
    },

    async session({ session, token }) {
      const _token = get(token, "token");
      const refresh_token_expire = get(token, "refresh_token_expire");

      if (_token) {
        set(session, "user.token", _token);
      }

      if (refresh_token_expire != undefined) {
        set(session, "user.refresh_token_expire", refresh_token_expire);
      }

      return session;
    },
  },
});
