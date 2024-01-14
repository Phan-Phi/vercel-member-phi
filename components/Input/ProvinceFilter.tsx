import React from "react";
import { useToggle } from "react-use";

import useSWR from "swr";
import { Autocomplete } from "@mui/material";

import { PROVINCE } from "apis";
import { ProvinceTuple } from "interfaces";
import { InputForAutocomplete } from "components";

interface ProvinceProps {
  value: any;
  onChange: (value: any) => void;
}

const ProvinceBase = (props: ProvinceProps) => {
  const { onChange, value } = props;

  const [isShown, toggleIsShown] = useToggle(false);

  const { data } = useSWR<ProvinceTuple[]>(() => {
    if (isShown) return PROVINCE;

    return PROVINCE;
  });

  return (
    <Autocomplete
      options={data ?? []}
      open={isShown}
      value={value}
      onChange={(_, value) => onChange(value)}
      onOpen={() => toggleIsShown(true)}
      onClose={() => toggleIsShown(false)}
      renderInput={(props) => {
        return (
          <InputForAutocomplete
            label="Tỉnh / Thành"
            placeholder="Tỉnh / Thành"
            {...props}
          />
        );
      }}
      loading={!data && isShown}
      getOptionLabel={(option) => option["1"]}
    />
  );
};
export default ProvinceBase;
