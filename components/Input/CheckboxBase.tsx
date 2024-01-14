import * as React from "react";

import {
  FormGroup,
  FormControl,
  FormHelperText,
  FormLabelProps,
  FormGroupProps,
  FormControlProps,
  FormHelperTextProps,
} from "@mui/material";

import FormLabel from "./FormLabel";

type CheckboxProps = {
  label?: string;
  renderItem?: () => React.ReactNode;
  FormGroupProps?: FormGroupProps;
  FormLabelProps?: FormLabelProps;
  FormControlProps?: FormControlProps;
  FormHelperTextProps?: FormHelperTextProps;
};

export default function Checkbox(props: CheckboxProps) {
  const {
    label,
    renderItem,
    FormLabelProps,
    FormGroupProps,
    FormControlProps,
    FormHelperTextProps,
  } = props;

  return (
    <FormControl {...FormControlProps}>
      <FormLabel {...FormLabelProps}>{label}</FormLabel>

      <FormGroup {...FormGroupProps}>{renderItem && renderItem()}</FormGroup>

      <FormHelperText {...FormHelperTextProps} />
    </FormControl>
  );
}
