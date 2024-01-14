import { Box, Button, Divider, MenuItem, Stack, Typography } from "@mui/material";

import { useChoice } from "hooks";
import { CommonFilterTableProps } from "interfaces";

import { BoxWithShadow, DateRangePicker, Select } from "components";
import { TabListingTransactionHistoryFilterType } from "./TabListingTransactionHistory";

type FilterProps = CommonFilterTableProps<TabListingTransactionHistoryFilterType> & {
  onTransactionChange: (value: any) => void;
};

const FilterTabListingTransactionHistory = (props: FilterProps) => {
  const { onTransactionChange, filter, resetFilter, onFilterByTime, onDateRangeChange } =
    props;

  const { transaction_type } = useChoice();

  return (
    <BoxWithShadow>
      <Stack divider={<Divider />} spacing={2}>
        <Box>
          <Typography fontWeight={700} marginBottom={1}>
            Loại giao dịch
          </Typography>

          <Select
            renderItem={() => {
              return [["", "Tất cả"], ...transaction_type].map((el) => {
                return (
                  <MenuItem key={el[0]} value={el[0]}>
                    {el[1]}
                  </MenuItem>
                );
              });
            }}
            SelectProps={{
              onChange: (e) => {
                onTransactionChange(e.target.value);
              },
              value: filter.transaction_type,
            }}
          />

          {/* <Radio
            RadioGroupProps={{
              value: params?.transaction_type ? params?.transaction_type : "",
              onChange(event, value) {
                onFilterHandler("transaction_type")(value);
              },
            }}
            renderItem={() => {
              return [["", "Tất cả"], ...transaction_type].map((el) => {
                return (
                  <RadioItem
                    label={el[1]}
                    key={el[0]}
                    RadioProps={{
                      value: el[0],
                    }}
                  />
                );
              });
            }}
          /> */}
        </Box>

        <Box>
          <Typography fontWeight={700} marginBottom={1}>
            Ngày tạo
          </Typography>

          <DateRangePicker
            ranges={[filter.range]}
            onChange={(ranges) => {
              const range = ranges.range;
              range && onDateRangeChange && onDateRangeChange(range);
            }}
            onFilterByTime={onFilterByTime}
          />
        </Box>

        <Box>
          <Button fullWidth variant="outlined" color="error" onClick={resetFilter}>
            Bỏ Lọc
          </Button>
        </Box>
      </Stack>
    </BoxWithShadow>
  );
};

export default FilterTabListingTransactionHistory;
