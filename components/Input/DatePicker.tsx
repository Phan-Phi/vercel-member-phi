import * as React from "react";
import { Controller, Control, Path } from "react-hook-form";

import {
  FormControl,
  FormHelperText,
  InputProps,
  FormLabelProps,
  FormControlProps,
  FormHelperTextProps,
} from "@mui/material";

import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import InputBase from "./InputBase";
import FormLabel from "./FormLabel";

type CommonProps<V> = {
  label?: string;
  placeholder?: string;
  InputProps?: InputProps;
  FormLabelProps?: FormLabelProps;
  FormControlProps?: FormControlProps;
  FormHelperTextProps?: FormHelperTextProps;
  DatePickerProps?: Omit<DatePickerProps<V, V>, "value" | "onChange" | "renderInput">;
};

type ConditionalProps<T extends Record<string, any>, V> =
  | {
      control: Control<T, any>;
      name: Path<T>;
      value?: never;
      onChange?: never;
    }
  | {
      name?: never;
      control?: undefined;
      value: V;
      onChange: (value: unknown, keyboardInputValue?: string | undefined) => void;
    };

export type Props<T extends Record<string, any>, V> = CommonProps<V> &
  ConditionalProps<T, V>;

export default function CustomDatePicker<
  T extends Record<string, any>,
  V extends Date | number | null | undefined
>(props: Props<T, V>) {
  const {
    name,
    label,
    value,
    control,
    onChange,
    InputProps,
    placeholder,
    FormLabelProps,
    DatePickerProps,
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
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                PaperProps={{
                  sx: {
                    ["& .Mui-selected"]: {
                      backgroundColor: (theme) => {
                        return `${theme.palette.primary2.light} !important`;
                      },
                    },
                  },
                }}
                inputFormat="dd/MM/yyyy"
                value={value as V}
                onChange={(value) => {
                  onChange(value);
                }}
                renderInput={(params) => {
                  const { InputProps: InternalInputProps, inputProps, inputRef } = params;

                  return (
                    <FormControl {...FormControlProps}>
                      <FormLabel {...FormLabelProps}>{label}</FormLabel>
                      <InputBase
                        {...InternalInputProps}
                        inputProps={inputProps}
                        ref={inputRef}
                        placeholder={placeholder}
                        {...InputProps}
                      />
                      <FormHelperText {...FormHelperTextProps} />
                    </FormControl>
                  );
                }}
                {...DatePickerProps}
              />
            </LocalizationProvider>
          );
        }}
      />
    );
  } else if (!control && !name) {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          PaperProps={{
            sx: {
              ["& .Mui-selected"]: {
                backgroundColor: (theme) => {
                  return `${theme.palette.primary2.light} !important`;
                },
              },
            },
          }}
          inputFormat="dd/MM/yyyy"
          value={value}
          onChange={onChange}
          renderInput={(params) => {
            const { InputProps: InternalInputProps, inputProps, inputRef } = params;

            return (
              <FormControl {...FormControlProps}>
                <FormLabel {...FormLabelProps}>{label}</FormLabel>
                <InputBase
                  {...InternalInputProps}
                  inputProps={inputProps}
                  ref={inputRef}
                  placeholder={placeholder}
                  {...InputProps}
                />
                <FormHelperText {...FormHelperTextProps} />
              </FormControl>
            );
          }}
          {...DatePickerProps}
        />
      </LocalizationProvider>
    );
  } else {
    return null;
  }
}
