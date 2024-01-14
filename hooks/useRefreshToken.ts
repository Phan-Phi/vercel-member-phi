import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { differenceInSeconds } from "date-fns";

import get from "lodash/get";
import pick from "lodash/pick";

import axios, { type AxiosResponse } from "axios";

export const useRefreshToken = () => {
  const { status, data } = useSession();

  // useEffect(() => {
  //   if (status === "authenticated") {
  //     const { expires, user } = data;

  //     const result = differenceInSeconds(new Date(expires), Date.now());

  //     const THRESHOLD = 60 * 60 * 12;

  //     if (result < THRESHOLD && !user.refresh_token_expire) {
  //       axios.get("/api/refresh-token").then((res: AxiosResponse<string | null>) => {
  //         const { data } = res;

  //         if (data) {
  //           const body = pick(JSON.parse(data), [
  //             "csrf_token",
  //             "refresh_token",
  //             "email",
  //             "token",
  //             "refresh_token_expire",
  //           ]);

  //           const refreshToken: string = get(data, "refresh_token");
  //           const csrfToken: string = get(data, "csrf_token");

  //           if (csrfToken && refreshToken) {
  //             signIn("refresh-token", {
  //               redirect: false,
  //               ...body,
  //             });
  //           }
  //         }
  //       });
  //     }
  //   }
  // }, [status]);
};
