import useSWR from "swr";
import React, { createContext, useMemo } from "react";

import { CHOICES } from "apis";
import { ChoiceType } from "interfaces";

interface ChoiceProps {
  children: React.ReactNode;
}

export const ChoiceContext = createContext<ChoiceType>({} as ChoiceType);

const Choice = ({ children }: ChoiceProps) => {
  const { data } = useSWR(CHOICES, {
    refreshInterval: 300 * 1000,
  });

  const choiceMemo = useMemo<ChoiceType>(() => {
    if (data == undefined) {
      return {} as ChoiceType;
    }
    return data;
  }, [data]);

  return <ChoiceContext.Provider value={choiceMemo}>{children}</ChoiceContext.Provider>;
};

export default Choice;
