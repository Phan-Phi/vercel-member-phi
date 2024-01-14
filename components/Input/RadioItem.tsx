import React from "react";

import {
  Radio,
  RadioProps,
  FormControlLabel,
  FormControlLabelProps,
} from "@mui/material";

type RadioItemProps = {
  label?: string;
  RadioProps?: RadioProps;
  FormControlLabelProps?: FormControlLabelProps;
};
const RadioItem = (props: RadioItemProps) => {
  const { label, RadioProps, FormControlLabelProps } = props;

  return (
    <FormControlLabel
      control={<Radio {...RadioProps} />}
      label={label}
      {...FormControlLabelProps}
    />
  );
};

export default RadioItem;
