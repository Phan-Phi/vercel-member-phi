import { Box, Button, Divider, MenuItem, Stack, Typography } from "@mui/material";

import {
  BoxWithShadow,
  DateRangePicker,
  FilterByTimeRange,
  SelectBase,
} from "components";
import { useChoice } from "hooks";

import { HomeFilterType } from "./Home";
import { CommonFilterTableProps } from "interfaces";

type HomeFilterProps = CommonFilterTableProps<HomeFilterType> & {
  onChangeActionHandler: (value: any) => void;
};

const HomeFilter = (props: HomeFilterProps) => {
  const {
    filter,
    resetFilter,
    onFilterByTime,
    onDateRangeChange,
    onChangeActionHandler,
  } = props;

  const { auditlog_actions } = useChoice();

  return (
    <BoxWithShadow>
      <Stack divider={<Divider />} spacing={2}>
        <Box>
          <Typography variant="h3" fontWeight={700} marginBottom={1}>
            Thao tác
          </Typography>

          <SelectBase
            renderItem={() => {
              return [["", "Tất cả"], ...auditlog_actions].map((el) => {
                return (
                  <MenuItem key={el[0]} value={el[0]}>
                    {el[1]}
                  </MenuItem>
                );
              });
            }}
            SelectProps={{
              onChange: onChangeActionHandler,
              value: filter.action,
            }}
          />
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

export default HomeFilter;
