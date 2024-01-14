import { useMemo } from "react";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";

import { useChoice } from "hooks";
import { CommonFilterTableProps } from "interfaces";
import { PartnerFilterType } from "./ListingNotification";
import { BoxWithShadow, DateRangePicker, FilterByTimeRange } from "components";
import { getDisplayValueFromChoiceItem } from "libs";
import LazyAutocompleteChoice from "components/Input/LazyAutocompleteChoice";
import { BUTTON } from "constant";

// interface FilterProps {
//   params: Record<string, any>;
//   resetParams: () => void;
//   onFilterHandler: (key: string) => (value: any) => void;
// }
type FilterProps = CommonFilterTableProps<PartnerFilterType> & {
  onAppTypeChange: (value: any) => void;
};

const FilterNotification = (props: FilterProps) => {
  const {
    resetFilter,
    filter,
    onFilterByTime,
    onDateStartChange,
    onDateEndChange,
    onAppTypeChange,
    onDateRangeChange,
  } = props;

  const choice = useChoice();
  const { app_type } = choice;

  const renderPosition = useMemo(() => {
    if (true) {
      return (
        <Box>
          <Typography variant="h3" fontWeight={700} marginBottom={1}>
            Đối Tượng
          </Typography>

          <LazyAutocompleteChoice
            {...{
              data: app_type,
              placeholder: "Đối tượng",
              AutocompleteProps: {
                getOptionLabel: (option: string) => {
                  const value = getDisplayValueFromChoiceItem(app_type, option[0]);

                  return value;
                },
                onChange: (_: any, value: any) => {
                  onAppTypeChange(value);
                },
                value: filter.app_type,
              },
            }}
          />
        </Box>
      );
    }

    return null;
  }, [filter]);

  return (
    <BoxWithShadow>
      <Stack divider={<Divider />} spacing={2}>
        {renderPosition}

        <Box>
          <Typography variant="h3" fontWeight={700} marginBottom={1}>
            Ngày Tạo
          </Typography>

          {/* <FilterByTimeRange
            onDateStartChange={onDateStartChange}
            onDateEndChange={onDateEndChange}
            dateStart={filter.date_created_start}
            dateEnd={filter.date_created_end}
            onClickFilter={onFilterByTime}
          /> */}

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
            {BUTTON.REMOVE_FILTER}
          </Button>
        </Box>
      </Stack>
    </BoxWithShadow>
  );
};

export default FilterNotification;
