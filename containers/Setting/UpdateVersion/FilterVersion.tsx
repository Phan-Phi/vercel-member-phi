import useSWR from "swr";
import { useMemo } from "react";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";

import {
  BoxWithShadow,
  DateRangePicker,
  FilterByTimeRange,
  LazyAutocompleteV2,
  Loading,
  RadioBase,
  RadioItem,
} from "components";
import { GROUPS } from "apis";
import { transformUrl } from "libs";
import { CommonFilterTableProps, GROUPS_ITEM, responseSchema } from "interfaces";
import { VersionFilterType } from "./ListingUpdateVersion";

// interface FilterProps {
//   params: Record<string, any>;
//   resetParams: () => void;
//   onFilterHandler: (key: string) => (value: any) => void;
// }
type FilterProps = CommonFilterTableProps<VersionFilterType> & {
  onGroupChange: (value: any) => void;
  onUpdateChange: (value: any) => void;
  onAppChange: (value: any) => void;
};

const ACTIVE_UPDATE = [
  { title: "Tất cả", value: "" },
  { title: "Có", value: "true" },
  { title: "Không", value: "false" },
];

const ACTIVE_APP = [
  { title: "Tất cả", value: "" },
  { title: "IOS", value: "ios" },
  { title: "Android", value: "android" },
];

const FilterVersion = (props: any) => {
  const {
    resetFilter,
    filter,
    onFilterByTime,
    onDateStartChange,
    onDateEndChange,
    onGroupChange,
    onUpdateChange,
    onDateRangeChange,
    onAppChange,
  } = props;

  return (
    <BoxWithShadow>
      <Stack divider={<Divider />} spacing={2}>
        <Box>
          <Typography variant="h3" fontWeight={700} marginBottom={1}>
            Bắt Buộc Cập Nhật
          </Typography>

          <RadioBase
            RadioGroupProps={{
              value: filter.deprecated,
              onChange(_, value) {
                onUpdateChange(value);
              },
            }}
            renderItem={() => {
              return ACTIVE_UPDATE.map((el) => {
                return (
                  <RadioItem
                    label={el.title}
                    key={el.value as any}
                    RadioProps={{
                      value: el.value,
                    }}
                  />
                );
              });
            }}
          />
        </Box>

        <Box>
          <Typography variant="h3" fontWeight={700} marginBottom={1}>
            Hệ Điều Hành
          </Typography>

          <RadioBase
            RadioGroupProps={{
              value: filter.appPlatform,
              onChange(_, value) {
                onAppChange(value);
              },
            }}
            renderItem={() => {
              return ACTIVE_APP.map((el) => {
                return (
                  <RadioItem
                    label={el.title}
                    key={el.value}
                    RadioProps={{
                      value: el.value,
                    }}
                  />
                );
              });
            }}
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

export default FilterVersion;
