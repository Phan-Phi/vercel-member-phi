import React, { useMemo, useRef } from "react";
import { Box, Button, Popover, Stack, styled, useTheme } from "@mui/material";

import {
  Range,
  DateRangePickerProps,
  DateRangePicker as OriginalDateRangePicker,
  defaultStaticRanges,
  defaultInputRanges,
} from "react-date-range";

import { useToggle } from "hooks";
import { formatDate } from "libs";
import InputBase from "./Input/InputBase";

import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { BUTTON } from "constant";

const DateRangePicker = (
  props: DateRangePickerProps & {
    onFilterByTime?: () => void;
  }
) => {
  const theme = useTheme();

  const { ranges, onFilterByTime, ...restProps } = props;

  const anchorRef = useRef<HTMLDivElement>();

  const { open, onOpen, onClose } = useToggle();

  const newDefaultStaticRanges = useMemo(() => {
    const newLabel: Record<string, string> = {
      Today: "Hôm nay",
      Yesterday: "Hôm qua",
      "This Week": "Tuần này",
      "Last Week": "Tuần trước",
      "This Month": "Tháng này",
      "Last Month": "Tháng trước",
    };

    return defaultStaticRanges.map((el) => {
      const oldLabel = el.label;
      return {
        ...el,
        label: oldLabel ? newLabel[oldLabel] : oldLabel,
      };
    });
  }, []);

  const newDefaultInputRanges = useMemo(() => {
    const newLabel: Record<string, string> = {
      "days up to today": "Số ngày tính đến hôm nay",
      "days starting today": "Số ngày tính từ hôm nay",
    };

    return defaultInputRanges.map((el) => {
      const oldLabel = el.label;
      return {
        ...el,
        label: oldLabel ? newLabel[oldLabel] : oldLabel,
      };
    });
  }, []);

  return (
    <Stack spacing={1}>
      <Box onClick={onOpen}>
        <StyledInputBase fullWidth value={formatDateRange(ranges?.[0])} />
      </Box>

      <Box ref={anchorRef} />
      <Popover
        open={open}
        onClose={onClose}
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <OriginalDateRangePicker
          months={2}
          direction="horizontal"
          maxDate={new Date()}
          dateDisplayFormat="dd/MM/yyyy"
          fixedHeight
          ranges={ranges}
          rangeColors={[theme.palette.primary2.light, "#3ecf8e", "#fed14c"]}
          staticRanges={newDefaultStaticRanges}
          inputRanges={newDefaultInputRanges}
          monthDisplayFormat="MM/yyyy"
          startDatePlaceholder="Từ Ngày"
          endDatePlaceholder="Đến Ngày"
          {...restProps}
        />
      </Popover>

      <Button
        fullWidth
        variant="outlined"
        disabled={!ranges?.[0]?.startDate}
        onClick={onFilterByTime}
      >
        {BUTTON.FILTER}
      </Button>
    </Stack>
  );
};

const formatDateRange = (range?: Range) => {
  if (range == undefined) return "";

  const { endDate, startDate } = range;

  let startDateStr = "Từ ngày";
  let endDateStr = "Đến ngày";

  if (startDate) {
    startDateStr = formatDate(startDate, "dd/MM/yyyy");
  }

  if (endDate) {
    endDateStr = formatDate(endDate, "dd/MM/yyyy");
  }

  return `${startDateStr} → ${endDateStr}`;
};

const StyledInputBase = styled(InputBase)(() => {
  return {
    pointerEvents: "none",
  };
});

export default DateRangePicker;
