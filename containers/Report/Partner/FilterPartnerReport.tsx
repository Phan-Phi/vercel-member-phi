import { Stack, Button, Divider } from "@mui/material";

import { CommonFilterTableProps } from "interfaces";

import { DateRangePicker } from "components";
import { PartnerReportByTableFilterType } from "./PartnerReportByTable";

type FilterProps = CommonFilterTableProps<PartnerReportByTableFilterType> & {};

const FilterPartnerReport = (props: FilterProps) => {
  const { filter, resetFilter, onFilterByTime, onDateRangeChange } = props;

  return (
    <Stack divider={<Divider />} spacing={2}>
      {/* <Select
        renderItem={() => {
          return TIME_FRAME.map((el) => {
            return (
              <MenuItem key={el[0]} value={el[0]}>
                {el[1]}
              </MenuItem>
            );
          });
        }}
        SelectProps={{
          value: filter.date_start && filter.date_end ? "" : filter.timeFrame,
          onChange: (e) => {
            onTimeFrameChange(e.target.value);
          },
        }}
        label="Chọn thời gian"
      /> */}

      <DateRangePicker
        ranges={[filter.range]}
        onChange={(ranges) => {
          const range = ranges.range;
          range && onDateRangeChange && onDateRangeChange(range);
        }}
        onFilterByTime={onFilterByTime}
      />

      <Button variant="outlined" color="error" onClick={resetFilter}>
        Bỏ Lọc
      </Button>
    </Stack>
  );
};

export default FilterPartnerReport;
