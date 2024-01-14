import React from "react";

import {
  Checkbox,
  CheckboxProps,
  FormControlLabel,
  FormControlLabelProps,
} from "@mui/material";

type CheckboxItemProps = {
  label?: string;
  CheckboxProps?: CheckboxProps;
  FormControlLabelProps?: Omit<FormControlLabelProps, "control" | "label"> & {
    control?: FormControlLabelProps["control"];
    label?: FormControlLabelProps["label"];
  };
};

const CheckboxItem = (props: CheckboxItemProps) => {
  const { label, CheckboxProps, FormControlLabelProps } = props;

  return (
    <FormControlLabel
      control={<Checkbox {...CheckboxProps} />}
      label={label}
      {...FormControlLabelProps}
    />
  );
};

export default CheckboxItem;
