import { UseControllerReturn } from "react-hook-form";

import {
  FormControl,
  FormHelperText,
  FormLabelProps,
  FormControlProps,
  FormHelperTextProps,
  FormGroup,
  FormGroupProps,
} from "@mui/material";

import FormLabel from "./FormLabel";

type ExtendedSwitchProps = {
  controlState: any;
  label?: React.ReactNode;
  FormLabelProps?: FormLabelProps;
  FormControlProps?: FormControlProps;
  FormHelperTextProps?: FormHelperTextProps;
  FormGroupProps?: FormGroupProps;
  renderItem?: () => React.ReactNode;
};

function Switch(props: ExtendedSwitchProps) {
  const {
    label,
    renderItem,
    FormLabelProps,
    FormControlProps,
    FormHelperTextProps,
    FormGroupProps,
    controlState,
  } = props;

  const { field, fieldState } = controlState as UseControllerReturn;

  const { name } = field;
  const { error } = fieldState;

  return (
    <FormControl fullWidth={false} error={!!error} {...FormControlProps}>
      <FormLabel htmlFor={name} {...FormLabelProps}>
        {label}
      </FormLabel>

      <FormGroup {...FormGroupProps}>{renderItem && renderItem()}</FormGroup>

      <FormHelperText {...FormHelperTextProps}>{error && error.message}</FormHelperText>
    </FormControl>
  );
}

export default Switch;
