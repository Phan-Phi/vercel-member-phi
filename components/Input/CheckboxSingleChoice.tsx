import { useCallback } from "react";
import { UseControllerReturn } from "react-hook-form";

import {
  FormGroup,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabelProps,
  FormGroupProps,
  FormControlProps,
  FormHelperTextProps,
  FormControlLabel,
  FormControlLabelProps,
  CheckboxProps as MuiCheckboxProps,
} from "@mui/material";

import FormLabel from "./FormLabel";

type CheckboxProps = {
  label?: string;
  controlState: any;
  CheckboxProps?: MuiCheckboxProps;
  checkboxLabel?: React.ReactNode;
  FormGroupProps?: FormGroupProps;
  FormLabelProps?: FormLabelProps;
  FormControlProps?: FormControlProps;
  FormHelperTextProps?: FormHelperTextProps;
  FormControlLabelProps?: FormControlLabelProps;
};

export default function CheckboxSingleChoice(props: CheckboxProps) {
  const {
    label,
    checkboxLabel,
    CheckboxProps,
    controlState,
    FormLabelProps,
    FormGroupProps,
    FormControlProps,
    FormHelperTextProps,
    FormControlLabelProps,
  } = props;

  const { field, fieldState } = controlState as UseControllerReturn;
  const { onChange, ref, value, name } = field;
  const { error } = fieldState;

  const onChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.checked);
    },
    [onChange]
  );

  return (
    <FormControl {...FormControlProps} error={!!error}>
      <FormLabel {...FormLabelProps}>{label}</FormLabel>

      <FormGroup {...FormGroupProps}>
        <FormControlLabel
          control={
            <Checkbox
              name={name}
              checked={value}
              onChange={onChangeHandler}
              inputRef={ref}
              {...CheckboxProps}
            />
          }
          label={checkboxLabel}
          {...FormControlLabelProps}
        />
      </FormGroup>

      <FormHelperText {...FormHelperTextProps}>{error?.message}</FormHelperText>
    </FormControl>
  );
}
