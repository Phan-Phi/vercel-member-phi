import useSWR from "swr";
import { useSession } from "next-auth/react";
import React, { createContext, useMemo } from "react";

import { SETTINGS } from "apis";
import { SETTINGS_ITEM } from "interfaces";
import { transformUrl } from "libs";

type Props = {
  children: React.ReactNode;
};

export const SettingContext = createContext<SETTINGS_ITEM>({} as SETTINGS_ITEM);

const Choice = ({ children }: Props) => {
  const { status } = useSession();

  const { data } = useSWR<SETTINGS_ITEM>(() => {
    if (status !== "authenticated") return;

    return transformUrl(SETTINGS, {
      use_cache: false,
    });
  });

  const contextValue = useMemo<SETTINGS_ITEM>(() => {
    if (data == undefined) return {} as SETTINGS_ITEM;

    return data;
  }, [data]);

  return (
    <SettingContext.Provider value={contextValue}>{children}</SettingContext.Provider>
  );
};

export default Choice;
