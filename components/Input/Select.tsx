import * as React from "react";
import { Controller, Control, Path, FieldValues } from "react-hook-form";

import {
  styled,
  Select,
  useTheme,
  SelectProps,
  FormControl,
  FormHelperText,
  FormLabelProps,
  FormControlProps,
  FormHelperTextProps,
} from "@mui/material";

import FormLabel from "./FormLabel";

type CommonProps = {
  placeholder?: string;
  label?: string;
  SelectProps?: SelectProps;
  FormLabelProps?: FormLabelProps;
  renderItem?: () => React.ReactNode;
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

export default function CustomSelect<T extends FieldValues>(props: Props<T>) {
  const {
    name,
    label,
    control,
    renderItem,
    SelectProps,
    placeholder,
    FormLabelProps,
    FormControlProps,
    FormHelperTextProps,
  } = props;

  const theme = useTheme();

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

              <StyledSelect
                placeholder={placeholder}
                SelectDisplayProps={{
                  style: {
                    padding: 8,
                    borderColor: theme.palette.grey[300],
                    borderWidth: 1,
                    borderStyle: "solid",
                    backgroundColor: SelectProps?.readOnly
                      ? "#bdbdbd"
                      : theme.palette.common.white,
                  },
                }}
                color="primary2"
                {...SelectProps}
                value={value}
                onChange={onChange}
              >
                {renderItem && renderItem()}
              </StyledSelect>

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

        <StyledSelect
          SelectDisplayProps={{
            style: {
              padding: 8,
              borderColor: theme.palette.grey[300],
              borderWidth: 1,
              borderStyle: "solid",
            },
          }}
          color="primary2"
          {...SelectProps}
        >
          {renderItem && renderItem()}
        </StyledSelect>

        <FormHelperText {...FormHelperTextProps} />
      </FormControl>
    );
  }
}

const StyledSelect = styled(Select)(({ theme }) => {
  return {
    ["&:hover .MuiOutlinedInput-notchedOutline"]: {
      borderColor: "transparent",
    },

    ["& .MuiOutlinedInput-notchedOutline"]: {
      borderColor: "transparent",
    },
  };
});
