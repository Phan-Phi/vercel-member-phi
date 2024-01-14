import { useMemo } from "react";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";

import { useChoice } from "hooks";
import { CommonFilterTableProps } from "interfaces";
import { getDisplayValueFromChoiceItem } from "libs";
import { PartnerFilterType } from "./ListingAdvertisement";
import { BoxWithShadow, DateRangePicker, FilterByTimeRange } from "components";
import LazyAutocompleteChoice from "components/Input/LazyAutocompleteChoice";
import { BUTTON } from "constant";

// interface FilterProps {
//   params: Record<string, any>;
//   resetParams: () => void;
//   onFilterHandler: (key: string) => (value: any) => void;
// }
type FilterProps = CommonFilterTableProps<PartnerFilterType> & {
  onAppTypeContainChange: (value: any) => void;
  onPositionContainChange: (value: any) => void;
};

const FilterAdvertisement = (props: FilterProps) => {
  const {
    // onFilterHandler,
    resetFilter,
    filter,
    onFilterByTime,
    onDateStartChange,
    onDateEndChange,
    onAppTypeContainChange,
    onPositionContainChange,
    onDateRangeChange,
  } = props;

  const choice = useChoice();
  const { app_type, position } = choice;

  const renderAppType = useMemo(() => {
    if (app_type) {
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
                  onAppTypeContainChange(value);
                },
                value: filter.app_type_contain,
              },
            }}
          />
        </Box>
      );
    }

    return null;
  }, [app_type, filter]);

  const renderPosition = useMemo(() => {
    if (position) {
      return (
        <Box>
          <Typography variant="h3" fontWeight={700} marginBottom={1}>
            Vị Trí
          </Typography>

          <LazyAutocompleteChoice
            {...{
              data: position,
              placeholder: "Vị trí",
              AutocompleteProps: {
                getOptionLabel: (option: string) => {
                  const value = getDisplayValueFromChoiceItem(position, option[0]);

                  return value;
                },
                onChange: (_: any, value: any) => {
                  onPositionContainChange(value);
                },
                value: filter.position_contain,
              },
            }}
          />
        </Box>
      );
    }

    return null;
  }, [position, filter]);

  return (
    <BoxWithShadow>
      <Stack divider={<Divider />} spacing={2}>
        {renderPosition}
        {renderAppType}

        <Box>
          <Typography variant="h3" fontWeight={700} marginBottom={1}>
            Trong Khoảng
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

export default FilterAdvertisement;
