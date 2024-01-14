import React from "react";
import { UseControllerReturn } from "react-hook-form";
import InputNumber, { InputNumberProps } from "./InputNumber";

type FormControlForNumberProps = {
  controlState: any;
  label?: React.ReactNode;
  placeholder?: string;
} & InputNumberProps;

const FormCreditCard = (props: FormControlForNumberProps) => {
  const {
    label,
    InputProps,
    placeholder,
    controlState,
    FormLabelProps,
    FormControlProps,
    NumberFormatProps,
    FormHelperTextProps,
    readOnly,
    disabled,
  } = props;

  const { field, fieldState } = controlState as UseControllerReturn;

  const { name, onChange, ref, value } = field;
  const { error } = fieldState;

  return (
    <InputNumber
      readOnly={readOnly}
      disabled={disabled}
      FormControlProps={{
        error: !!error,
        ...FormControlProps,
      }}
      FormLabelProps={{
        children: label,
        ...FormLabelProps,
        htmlFor: name,
      }}
      InputProps={{
        endAdornment: InputProps?.endAdornment,
        inputRef: ref,
        inputProps: {
          id: name,
          placeholder: placeholder,

          ...InputProps,
        },
      }}
      NumberFormatProps={{
        value,
        onValueChange: (values) => {
          const { value } = values;

          if (value == undefined) {
            return onChange(0);
          }
          onChange(value);
        },

        ...NumberFormatProps,
      }}
      FormHelperTextProps={{ children: error && error.message, ...FormHelperTextProps }}
    />
  );
};

export default FormCreditCard;
