import { useContext } from "react";

import { SettingContext } from "context/Setting";

export const useSetting = () => {
  const data = useContext(SettingContext);

  return data;
};
