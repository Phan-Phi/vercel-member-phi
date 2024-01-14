import { Box, Button, Divider, Stack, Typography } from "@mui/material";

import { useChoice } from "hooks";
import { CommonFilterTableProps } from "interfaces";

import { ListingPointNoteFilterType } from "./ListingPointNote";
import { BoxWithShadow, DateRangePicker, Radio, RadioItem } from "components";

type FilterProps = CommonFilterTableProps<ListingPointNoteFilterType> & {
  onFilterFlowType: (value: any) => void;
  onFilterStatus: (value: any) => void;
};

const FilterListingPointNote = (props: FilterProps) => {
  const {
    onFilterFlowType,
    filter,
    resetFilter,
    onFilterByTime,
    onFilterStatus,
    onDateRangeChange,
  } = props;

  const { point_note_flow_types, point_note_statuses } = useChoice();

  return (
    <BoxWithShadow>
      <Stack divider={<Divider />} spacing={2}>
        <Box>
          <Typography variant="h3" fontWeight={700} marginBottom={1}>
            Loại yêu cầu
          </Typography>

          <Radio
            renderItem={() => {
              return [["", "Tất cả"], ...point_note_flow_types].map((el) => {
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
            RadioGroupProps={{
              onChange: (e) => {
                onFilterFlowType(e.target.value);
              },
              value: filter.flow_type,
            }}
          />
        </Box>
        <Box>
          <Typography fontWeight={700} marginBottom={1}>
            Trạng thái
          </Typography>

          <Radio
            RadioGroupProps={{
              value: filter.status,
              onChange(event, value) {
                onFilterStatus(value);
              },
            }}
            renderItem={() => {
              return [["", "Tất cả"], ...point_note_statuses].map((el) => {
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
          />
        </Box>

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

export default FilterListingPointNote;
