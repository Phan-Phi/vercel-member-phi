import { Stack, Button, Divider, Box, Typography } from "@mui/material";

import { CommonFilterTableProps, MERCHANTS_STORES_ITEM } from "interfaces";

import { MERCHANTS_STORES } from "apis";
import { DateRangePicker, LazyAutocompleteV2 } from "components";
import { CustomerReportByTableFilterType } from "./CustomerReportByTable";

type FilterProps = CommonFilterTableProps<CustomerReportByTableFilterType> & {
  onFirstStoreChange: (value: any) => void;
  onMemberOfStoreChange: (value: any) => void;
};

const FilterTable = (props: FilterProps) => {
  const {
    filter,
    resetFilter,
    onFilterByTime,
    onDateRangeChange,
    onFirstStoreChange,
    onMemberOfStoreChange,
  } = props;

  return (
    <Stack divider={<Divider />} spacing={2}>
      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          Thành viên đầu tiên
        </Typography>

        <LazyAutocompleteV2<MERCHANTS_STORES_ITEM>
          {...{
            url: MERCHANTS_STORES,
            placeholder: "Tên quán",
            AutocompleteProps: {
              getOptionLabel: (option) => option.name,
              onChange: (_, value) => {
                onFirstStoreChange(value);
              },
              value: filter.first_store,
              renderOption(props, option, state) {
                return (
                  <li {...props} key={option.self}>
                    {option.name}
                  </li>
                );
              },
            },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          Thành viên của quán
        </Typography>

        <LazyAutocompleteV2<MERCHANTS_STORES_ITEM>
          {...{
            url: MERCHANTS_STORES,
            placeholder: "Tên quán",
            AutocompleteProps: {
              getOptionLabel: (option) => {
                return option.name;
              },
              onChange: (_, value) => {
                onMemberOfStoreChange(value);
              },
              value: filter.store,
              renderOption(props, option, state) {
                return (
                  <li {...props} key={option.self}>
                    {option.name}
                  </li>
                );
              },
            },
          }}
        />
      </Box>

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

export default FilterTable;
