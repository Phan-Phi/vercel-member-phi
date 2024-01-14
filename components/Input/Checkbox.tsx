import * as React from "react";
import { Controller, Control, Path, FieldValues } from "react-hook-form";

import {
  FormGroup,
  FormControl,
  FormHelperText,
  FormLabelProps,
  FormGroupProps,
  FormControlProps,
  FormHelperTextProps,
} from "@mui/material";

import FormLabel from "./FormLabel";

type RenderItemType = ({
  value,
  onChange,
}: {
  value: boolean | undefined;
  onChange: (...event: any[]) => void;
}) => React.ReactNode;

type CommonProps = {
  label?: string;
  FormGroupProps?: FormGroupProps;
  FormLabelProps?: FormLabelProps;
  FormControlProps?: FormControlProps;
  FormHelperTextProps?: FormHelperTextProps;
};

type ConditionalProps<T extends FieldValues = FieldValues> =
  | {
      control: Control<T, any>;
      name: Path<T>;
      renderItem: RenderItemType;
    }
  | { control?: undefined; name?: never; renderItem: () => React.ReactNode };

export type Props<T extends FieldValues> = CommonProps & ConditionalProps<T>;

export default function CustomCheckbox<T extends FieldValues>(props: Props<T>) {
  const {
    label,
    name,
    control,
    renderItem,
    FormLabelProps,
    FormGroupProps,
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

              <FormGroup {...FormGroupProps}>
                {renderItem &&
                  renderItem({ value: value as boolean | undefined, onChange })}
              </FormGroup>

              <FormHelperText {...FormHelperTextProps} />
            </FormControl>
          );
        }}
      />
    );
  } else if (!control && !name) {
    return (
      <FormControl {...FormControlProps}>
        <FormLabel {...FormLabelProps}>{label}</FormLabel>

        <FormGroup {...FormGroupProps}>{renderItem && renderItem()}</FormGroup>

        <FormHelperText {...FormHelperTextProps} />
      </FormControl>
    );
  } else {
    return null;
  }
}
