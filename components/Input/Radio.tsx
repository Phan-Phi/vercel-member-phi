import React from "react";
import { Controller, Control, Path, FieldValues } from "react-hook-form";

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

type CommonProps = {
  label?: string;
  FormLabelProps?: FormLabelProps;
  RadioGroupProps?: RadioGroupProps;
  renderItem: () => React.ReactNode;
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

export default function CustomRadio<T extends FieldValues>(props: Props<T>) {
  const {
    name,
    label,
    control,
    renderItem,
    FormLabelProps,
    RadioGroupProps,
    FormControlProps,
    FormHelperTextProps,
  } = props;

  if (control && name) {
    return (
      <Controller
        control={control}
        name={name}
        render={(props) => {
          const {
            field: { onChange, value },
          } = props;

          return (
            <FormControl {...FormControlProps}>
              <FormLabel {...FormLabelProps}>{label}</FormLabel>

              <RadioGroup
                {...RadioGroupProps}
                value={value as boolean | undefined}
                onChange={(_, value) => {
                  onChange(value);
                }}
              >
                {renderItem && renderItem()}
              </RadioGroup>

              <FormHelperText {...FormHelperTextProps} />
            </FormControl>
          );
        }}
      />
    );
  } else {
    return (
      <FormControl {...FormControlProps}>
        <FormLabel {...FormLabelProps}>{label}</FormLabel>

        <RadioGroup {...RadioGroupProps}>{renderItem && renderItem()}</RadioGroup>

        <FormHelperText {...FormHelperTextProps} />
      </FormControl>
    );
  }
}
