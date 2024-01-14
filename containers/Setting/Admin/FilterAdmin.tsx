import useSWR from "swr";
import { useMemo } from "react";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";

import {
  BoxWithShadow,
  DateRangePicker,
  FilterByTimeRange,
  LazyAutocompleteV2,
  Loading,
} from "components";
import { GROUPS } from "apis";
import { transformUrl } from "libs";
import { PartnerFilterType } from "./ListingAdmin";
import { CommonFilterTableProps, GROUPS_ITEM, responseSchema } from "interfaces";

// interface FilterProps {
//   params: Record<string, any>;
//   resetParams: () => void;
//   onFilterHandler: (key: string) => (value: any) => void;
// }
type FilterProps = CommonFilterTableProps<PartnerFilterType> & {
  onGroupChange: (value: any) => void;
};

const FilterAdmin = (props: any) => {
  const {
    resetFilter,
    filter,
    onFilterByTime,
    onDateStartChange,
    onDateEndChange,
    onGroupChange,
    onDateRangeChange,
  } = props;

  const { data: groupData } = useSWR<responseSchema<GROUPS_ITEM>>(
    transformUrl(GROUPS, {
      limit: 1000,
    })
  );

  const renderPosition = useMemo(() => {
    if (groupData == undefined) {
      return <Loading />;
    }

    if (true) {
      return (
        <Box>
          <Typography fontWeight={700} marginBottom={1}>
            Nhân Sự
          </Typography>

          <LazyAutocompleteV2<GROUPS_ITEM>
            {...{
              url: GROUPS,
              placeholder: "Nhân sự",
              AutocompleteProps: {
                getOptionLabel: (option) => {
                  return option.name;
                },
                onChange: (_, value) => {
                  onGroupChange(value);
                },
                value: filter.group,
              },
            }}
          />
        </Box>
      );
    }

    return null;
  }, [groupData, filter]);

  return (
    <BoxWithShadow>
      <Stack divider={<Divider />} spacing={2}>
        {renderPosition}

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

export default FilterAdmin;
