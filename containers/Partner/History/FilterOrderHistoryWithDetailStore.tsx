import { Box, Button, Divider, Stack, Typography } from "@mui/material";

import { BoxWithShadow, DateRangePicker } from "components";

import { CommonFilterTableProps } from "interfaces";
import { OrderHistoryWithDetailStoreFilterType } from "./OrderHistoryWithDetailStore";

type FilterProps = CommonFilterTableProps<OrderHistoryWithDetailStoreFilterType> & {};

const FilterTransactionHistoryWithDetailPartner = (props: FilterProps) => {
  const { filter, resetFilter, onFilterByTime, onDateRangeChange } = props;

  return (
    <BoxWithShadow>
      <Stack divider={<Divider />} spacing={2}>
        <Box>
          <Typography variant="h3" fontWeight={700} marginBottom={1}>
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

export default FilterTransactionHistoryWithDetailPartner;
