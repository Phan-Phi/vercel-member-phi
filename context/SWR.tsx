import React from "react";
import { SWRConfig } from "swr";
import { useSession, signIn, signOut } from "next-auth/react";

import axios from "axios.config";

import { handleResponseAxiosError } from "libs";
import { useNotification } from "hooks";

type SWRProps = {
  children: React.ReactNode;
};

const SWR = ({ children }: SWRProps) => {
  const { status } = useSession();

  const { enqueueSnackbarWithError } = useNotification();

  if (status === "loading") return null;

  return (
    <SWRConfig
      value={{
        refreshInterval: 30000,
        revalidateOnMount: true,
        fetcher: async (resource) => {
          return axios
            .get(resource)
            .then(async (res) => {
              return res.data;
            })
            .catch(async (err) => {
              enqueueSnackbarWithError(err);
              await handleResponseAxiosError(err, signIn, signOut);
            });
        },
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWR;
