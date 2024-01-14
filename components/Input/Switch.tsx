import { Controller, Control, Path, FieldValues } from "react-hook-form";

import {
  Switch,
  SwitchProps,
  FormControl,
  FormHelperText,
  FormLabelProps,
  FormControlProps,
  FormHelperTextProps,
} from "@mui/material";

import FormLabel from "./FormLabel";

type CommonProps = {
  label?: string;
  SwitchProps?: SwitchProps;
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

function CustomSwitch<T extends FieldValues>(props: Props<T>) {
  const {
    name,
    label,
    control,
    SwitchProps,
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
          } = props;

          return (
            <FormControl {...FormControlProps}>
              <FormLabel {...FormLabelProps}>{label}</FormLabel>
              <Switch
                color="primary2"
                {...SwitchProps}
                onChange={onChange}
                checked={value as boolean}
              />
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
        <Switch color="primary2" {...SwitchProps} />
        <FormHelperText {...FormHelperTextProps} />
      </FormControl>
    );
  }
}

export default CustomSwitch;
