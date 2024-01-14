import React from "react";

import {
  RadioGroup,
  FormControl,
  FormHelperText,
  FormLabelProps,
  RadioGroupProps,
  FormControlProps,
  FormHelperTextProps,
} from "@mui/material";

import FormLabel from "./FormLabel";

type RadioBaseProps = {
  label?: React.ReactNode;
  FormLabelProps?: FormLabelProps;
  RadioGroupProps?: RadioGroupProps;
  renderItem: () => React.ReactNode;
  FormControlProps?: FormControlProps;
  FormHelperTextProps?: FormHelperTextProps;
};

export default function RadioBaseProps(props: RadioBaseProps) {
  const {
    label,
    renderItem,
    FormLabelProps,
    RadioGroupProps,
    FormControlProps,
    FormHelperTextProps,
  } = props;

  return (
    <FormControl {...FormControlProps}>
      <FormLabel {...FormLabelProps}>{label}</FormLabel>
      <RadioGroup {...RadioGroupProps}>{renderItem && renderItem()}</RadioGroup>
      <FormHelperText {...FormHelperTextProps} />
    </FormControl>
  );
}
