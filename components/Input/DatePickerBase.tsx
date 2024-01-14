import React from "react";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import InputForDatePicker from "./InputForDatePicker";

type PartialKey = "renderInput" | "value";

export type DatePickerBaseProps<V extends unknown> = Omit<
  DatePickerProps<V, V>,
  PartialKey
> & {
  value: V;
  renderInput?: DatePickerProps<V, V>["renderInput"];
};

const DatePickerBase = <V extends unknown>(props: DatePickerBaseProps<V>) => {
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
        renderInput={InputForDatePicker}
        {...props}
      />
    </LocalizationProvider>
  );
};

export default DatePickerBase;
