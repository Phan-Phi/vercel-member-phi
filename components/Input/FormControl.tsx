import React from "react";
import { Controller, Control, Path, FieldValues } from "react-hook-form";

import {
  InputProps,
  FormControl,
  FormHelperText,
  FormLabelProps,
  FormControlProps,
  FormHelperTextProps,
} from "@mui/material";

import InputBase from "./InputBase";
import FormLabel from "./FormLabel";

type CommonProps = {
  value?: string;
  label?: string;
  placeholder?: string;
  InputProps?: InputProps;
  FormLabelProps?: FormLabelProps;
  FormControlProps?: FormControlProps;
  FormHelperTextProps?: FormHelperTextProps;
};

type ConditionalProps<T extends FieldValues> =
  | {
      control: Control<T, any>;
      name: Path<T>;
    }
  | { control?: undefined; name?: never };

export type Props<T extends FieldValues> = CommonProps & ConditionalProps<T>;

const CustomFormControl = <T extends FieldValues>(props: Props<T>) => {
  const {
    value,
    name,
    label,
    control = undefined,
    InputProps,
    placeholder,
    FormLabelProps,
    FormControlProps,
    FormHelperTextProps,
  } = props;

  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        render={(props) => {
          const {
            field: { onChange, value },
            fieldState: { error },
          } = props;

          return (
            <FormControl {...FormControlProps} error={!!error}>
              <FormLabel {...FormLabelProps}>{label}</FormLabel>
              <InputBase
                placeholder={placeholder}
                {...InputProps}
                value={value}
                onChange={onChange}
              />
              <FormHelperText {...FormHelperTextProps}>
                {error?.message || FormHelperTextProps?.children}
              </FormHelperText>
            </FormControl>
          );
        }}
      />
    );
  } else {
    return (
      <FormControl {...FormControlProps}>
        <FormLabel {...FormLabelProps}>{label}</FormLabel>
        <InputBase placeholder={placeholder} value={value} {...InputProps} />
        <FormHelperText {...FormHelperTextProps} />
      </FormControl>
    );
  }
};

export default CustomFormControl;
