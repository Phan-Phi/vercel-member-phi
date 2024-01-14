import React from "react";
import { FormControl, TextFieldProps, FormHelperText } from "@mui/material";

import InputBase from "./InputBase";
import FormLabel from "./FormLabel";

const InputForDatePicker = (params: TextFieldProps) => {
  const {
    label,
    InputProps,
    inputProps,
    inputRef,
    placeholder,
    InputLabelProps,
    FormHelperTextProps,
    error,
  } = params;

  return (
    <FormControl error={!!error}>
      <FormLabel {...InputLabelProps}>{label}</FormLabel>
      <InputBase
        inputProps={inputProps}
        inputRef={inputRef}
        placeholder={placeholder}
        {...InputProps}
      />
      <FormHelperText {...FormHelperTextProps} />
    </FormControl>
  );
};

export default InputForDatePicker;
