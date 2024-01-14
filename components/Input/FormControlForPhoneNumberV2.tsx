import React, { forwardRef } from "react";
import { UseControllerReturn } from "react-hook-form";

import {
  InputProps,
  FormControl,
  FormHelperText,
  FormLabelProps,
  FormControlProps,
  FormHelperTextProps,
} from "@mui/material";

import PhoneInput from "react-phone-number-input/input";

import InputBase from "./InputBase";
import FormLabel from "./FormLabel";
import { DefaultInputComponentProps } from "react-phone-number-input";

type FormControlPhoneNumberInputProps = {
  controlState: any;
  label?: string;
  InputProps?: Omit<InputProps, "inputComponent" | "onChange" | "value">;
  FormLabelProps?: FormLabelProps;
  FormControlProps?: FormControlProps;
  FormHelperTextProps?: FormHelperTextProps;
  PhoneInputProps?: DefaultInputComponentProps;
};

const FormControlForPhoneNumberV2 = (props: FormControlPhoneNumberInputProps) => {
  const {
    label,
    FormLabelProps,
    FormControlProps,
    FormHelperTextProps,
    controlState,
    InputProps,
    PhoneInputProps,
  } = props;

  const { field, fieldState } = controlState as UseControllerReturn;

  const { name, onChange, ref, value } = field;
  const { error } = fieldState;

  return (
    <FormControl error={!!error} {...FormControlProps}>
      <FormLabel htmlFor={name} {...FormLabelProps}>
        {label || "Số điện thoại"}
      </FormLabel>
      <PhoneInput
        inputComponent={InputWithRef as any}
        country="VN"
        value={value}
        onChange={onChange}
        inputRef={ref}
        name={name}
        {...InputProps}
        {...PhoneInputProps}
      />
      <FormHelperText {...FormHelperTextProps} />
    </FormControl>
  );
};

const InputWithRef = forwardRef(function InputWithRef(props: InputProps, ref?: any) {
  const { inputRef, ...restProps } = props;
  const _inputRef = inputRef as any;

  return (
    <InputBase
      id={props.name}
      inputRef={(instance) => {
        ref && ref(instance);
        _inputRef && _inputRef(instance);
      }}
      {...restProps}
    />
  );
});

export default FormControlForPhoneNumberV2;
