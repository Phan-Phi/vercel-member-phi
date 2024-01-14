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

export type FormControlBaseProps = {
  InputProps?: InputProps;
  FormLabelProps?: FormLabelProps;
  FormControlProps?: FormControlProps;
  FormHelperTextProps?: FormHelperTextProps;
};

const FormControlBase = (props: FormControlBaseProps) => {
  const { FormControlProps, FormLabelProps, FormHelperTextProps, InputProps } = props;

  return (
    <FormControl {...FormControlProps} id="idInputBaseNe">
      <FormLabel {...FormLabelProps} />
      <InputBase {...InputProps} />
      <FormHelperText {...FormHelperTextProps} />
    </FormControl>
  );
};

export default FormControlBase;
