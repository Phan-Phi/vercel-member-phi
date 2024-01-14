import { Stack, Button, Divider } from "@mui/material";

import { CommonFilterTableProps } from "interfaces";
import { IFilterProps } from "./PartnerReportByChart";
import { ProvinceFilter, DateRangePicker } from "components";

type FilterProps = CommonFilterTableProps<IFilterProps> & {
  onProvinceChange: (value: any) => void;
};

const FilterRegion = (props: FilterProps) => {
  const { filter, onProvinceChange, resetFilter, onDateRangeChange, onFilterByTime } =
    props;

  return (
    <Stack divider={<Divider />} spacing={2}>
      <DateRangePicker
        ranges={[filter.range]}
        onChange={(ranges) => {
          const range = ranges.range;
          range && onDateRangeChange && onDateRangeChange(range);
        }}
        onFilterByTime={onFilterByTime}
      />

      <ProvinceFilter value={filter.province} onChange={onProvinceChange} />
      <Button variant="outlined" color="error" onClick={resetFilter}>
        Bỏ Lọc
      </Button>
    </Stack>
  );
};

export default FilterRegion;
