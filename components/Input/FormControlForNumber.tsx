import React from "react";
import { Controller, Control, Path, FieldValues } from "react-hook-form";
import NumberFormat, { NumberFormatPropsBase } from "react-number-format";

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
  label?: string;
  placeholder?: string;
  InputProps?: Omit<
    InputProps,
    | keyof NumberFormatPropsBase<typeof InputBase>
    | "customInput"
    | keyof React.ComponentPropsWithRef<"input">
  > & {
    readOnly?: boolean;
  };
  NumberFormatProps?: Omit<NumberFormatPropsBase<typeof InputBase>, "customInput">;
  FormLabelProps?: FormLabelProps;
  FormControlProps?: FormControlProps;
  FormHelperTextProps?: FormHelperTextProps;
};

type ConditionalProps<T extends FieldValues = FieldValues> =
  | {
      control: Control<T, any>;
      name: Path<T>;
    }
  | { control?: undefined; name?: never };

export type Props<T extends FieldValues> = CommonProps & ConditionalProps<T>;

const CustomFormControl = <T extends FieldValues>(props: Props<T>) => {
  const {
    name,
    label,
    control,
    InputProps,
    placeholder,
    FormLabelProps,
    FormControlProps,
    NumberFormatProps,
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
              <NumberFormat
                customInput={InputBase}
                allowNegative={false}
                thousandSeparator={true}
                placeholder={placeholder}
                {...NumberFormatProps}
                {...InputProps}
                value={value as string | number | null | undefined}
                onValueChange={(values) => {
                  const { floatValue } = values;
                  onChange(floatValue);
                }}
              />

              <FormHelperText {...FormHelperTextProps}>{error?.message}</FormHelperText>
            </FormControl>
          );
        }}
      />
    );
  } else {
    return (
      <FormControl {...FormControlProps}>
        <FormLabel {...FormLabelProps}>{label}</FormLabel>
        <NumberFormat
          customInput={InputBase}
          allowNegative={false}
          thousandSeparator={true}
          placeholder={placeholder}
          {...NumberFormatProps}
          {...InputProps}
        />

        <FormHelperText {...FormHelperTextProps} />
      </FormControl>
    );
  }
};

export default CustomFormControl;
