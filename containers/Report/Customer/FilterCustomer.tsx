import { Box, Stack, Button, Divider, Typography } from "@mui/material";

import { CUSTOMERS } from "apis";
import { CUSTOMERS_ITEM, CommonFilterTableProps } from "interfaces";

import { IFilterProps } from "./CustomerReport";
import { ProvinceFilter, DateRangePicker, LazyAutocompleteV2 } from "components";

type FilterProps = CommonFilterTableProps<IFilterProps> & {
  onProvinceChange: (value: any) => void;
  onCustomerChange: (value: any) => void;
  isShowCustomer: boolean;
};

const FilterCustomer = (props: FilterProps) => {
  const {
    filter,
    resetFilter,
    isShowCustomer,
    onFilterByTime,
    onCustomerChange,
    onProvinceChange,
    onDateRangeChange,
  } = props;
  return (
    <Stack divider={<Divider />} spacing={2}>
      {isShowCustomer && (
        <Box>
          <Typography fontWeight={700} marginBottom={1}>
            Khách hàng
          </Typography>

          <LazyAutocompleteV2<CUSTOMERS_ITEM>
            {...{
              url: CUSTOMERS,
              placeholder: "Khách hàng",
              AutocompleteProps: {
                getOptionLabel: (option) => {
                  return option.email;
                },
                onChange: (_, value) => {
                  onCustomerChange(value);
                },
                value: filter.customer,
              },
            }}
          />
        </Box>
      )}

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

export default FilterCustomer;
