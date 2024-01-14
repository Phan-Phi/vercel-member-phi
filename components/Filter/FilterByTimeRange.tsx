import React, { Fragment } from "react";
import { Button, Stack, styled, Typography } from "@mui/material";

import { startOfDay, endOfDay } from "date-fns";

import { DatePickerBase } from "components";

type FilterByTimeRangeProps = {
  dateStart?: number | Date | null | undefined;
  dateEnd?: number | Date | null | undefined;
  onDateStartChange?: (value: any) => void;
  onDateEndChange?: (value: any) => void;
  onClickFilter?: () => void;
  DatePickerPropsForStart?: React.ComponentPropsWithoutRef<typeof DatePickerBase>;
  DatePickerPropsForEnd?: React.ComponentPropsWithoutRef<typeof DatePickerBase>;
};

const FilterByTimeRange = (props: FilterByTimeRangeProps) => {
  const {
    dateStart,
    dateEnd,
    onDateEndChange,
    onDateStartChange,
    DatePickerPropsForStart,
    DatePickerPropsForEnd,
    onClickFilter,
  } = props;

  return (
    <Fragment>
      <Stack spacing={1}>
        <StyledCardItem>
          <StyledTypography variant="subtitle1">Từ ngày</StyledTypography>
          <DatePickerBase
            value={dateStart}
            onChange={(value) => {
              if (typeof value === "number" || value instanceof Date) {
                onDateStartChange && onDateStartChange(startOfDay(value));
              }
            }}
            maxDate={Date.now()}
            {...DatePickerPropsForStart}
          />
        </StyledCardItem>

        <StyledCardItem>
          <StyledTypography variant="subtitle1">Đến ngày</StyledTypography>
          <DatePickerBase
            value={dateEnd}
            onChange={(value) => {
              if (typeof value === "number" || value instanceof Date) {
                onDateEndChange && onDateEndChange(endOfDay(value));
              }
            }}
            minDate={dateStart}
            maxDate={Date.now()}
            {...DatePickerPropsForEnd}
          />
        </StyledCardItem>

        <Button variant="outlined" disabled={!dateStart} onClick={onClickFilter}>
          Lọc
        </Button>
      </Stack>
    </Fragment>
  );
};

const StyledTypography = styled(Typography)({
  width: 90,
});

const StyledCardItem = styled(Stack)({
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
});

export default FilterByTimeRange;
