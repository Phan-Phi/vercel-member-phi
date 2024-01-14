import useSWR from "swr";
import { useMemo } from "react";

import { Box, Button, Divider, Stack, Typography } from "@mui/material";

import {
  Loading,
  RadioItem,
  RadioBase,
  BoxWithShadow,
  DateRangePicker,
  LazyAutocompleteV2,
} from "components";
import { PartnerFilterType } from "./ListingPartner";

import {
  ADMINS_ITEM,
  GROUPS_ITEM,
  responseSchema,
  CommonFilterTableProps,
} from "interfaces";
import { transformUrl } from "libs";
import { ADMINS, GROUPS } from "apis";

const ACTIVE_DATA = [
  { title: "Tất cả", value: "" },
  { title: "Kích hoạt", value: "true" },
  { title: "Chưa kích hoạt", value: "false" },
];

type FilterProps = CommonFilterTableProps<PartnerFilterType> & {
  onActiveAccountChange: (value: any) => void;
  onActiveChange: (value: any) => void;
};

const Filter = (props: FilterProps) => {
  const {
    filter,
    resetFilter,
    onActiveChange,
    onFilterByTime,
    onDateRangeChange,
    onActiveAccountChange,
  } = props;

  const { data: groupData } = useSWR<responseSchema<GROUPS_ITEM>>(() => {
    return transformUrl(GROUPS, {
      limit: 1000,
    });
  });

  const renderActivatePerson = useMemo(() => {
    if (groupData == undefined) {
      return <Loading />;
    }

    const item = groupData.results.find((el) => {
      return el.name.toLowerCase().includes("sale");
    });

    if (item) {
      return (
        <Box>
          <Typography fontWeight={700} marginBottom={1}>
            Người Kích Hoạt
          </Typography>

          <LazyAutocompleteV2<ADMINS_ITEM>
            {...{
              url: ADMINS,
              placeholder: "Người kích hoạt",
              AutocompleteProps: {
                getOptionLabel: (option) => {
                  return option.email;
                },
                onChange: (_, value) => {
                  onActiveAccountChange(value);
                },
                value: filter.activated_by_person,
              },

              params: {
                group: item.self,
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
        {renderActivatePerson}

        <Box>
          <Typography fontWeight={700} marginBottom={1}>
            Trạng thái
          </Typography>

          <RadioBase
            RadioGroupProps={{
              value: filter.is_active,
              onChange(_, value) {
                onActiveChange(value);
              },
            }}
            renderItem={() => {
              return ACTIVE_DATA.map((el) => {
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

export default Filter;
