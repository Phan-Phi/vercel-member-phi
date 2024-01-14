import { BoxWithShadow, DateRangePicker, Select } from "components";
import { Box, Button, Divider, MenuItem, Stack, Typography } from "@mui/material";

import { useChoice } from "hooks";
import { CommonFilterTableProps } from "interfaces";
import { ListingAvatarFilterType } from "./ListingAvatar";

type FilterProps = CommonFilterTableProps<ListingAvatarFilterType> & {
  onSelectStatus: (value: any) => void;
  onSelectImage: (value: any) => void;
};

const STATUS_DATA = [
  { title: "Tất cả", value: "" },
  { title: "Hoàn tất", value: "true" },
  { title: "Chờ", value: "false" },
];

const FilterAvatar = (props: FilterProps) => {
  const {
    filter,
    resetFilter,
    onSelectImage,
    onFilterByTime,
    onSelectStatus,
    onDateRangeChange,
  } = props;
  const { pending_image_signature } = useChoice();

  return (
    <BoxWithShadow>
      <Stack divider={<Divider />} spacing={2}>
        <Box>
          <Typography variant="h3" fontWeight={700} marginBottom={1}>
            Trạng thái
          </Typography>

          <Select
            renderItem={() => {
              return STATUS_DATA.map((el) => {
                return (
                  <MenuItem key={el.value} value={el.value}>
                    {el.title}
                  </MenuItem>
                );
              });
            }}
            SelectProps={{
              onChange: (e) => {
                onSelectStatus(e.target.value);
              },
              value: filter.is_confirmed,
            }}
          />
        </Box>

        <Box>
          <Typography variant="h3" fontWeight={700} marginBottom={1}>
            Loại hình ảnh
          </Typography>

          <Select
            renderItem={() => {
              return [["", "Tất cả"], ...pending_image_signature].map((el) => {
                return (
                  <MenuItem key={el[0]} value={el[0]}>
                    {el[1]}
                  </MenuItem>
                );
              });
            }}
            SelectProps={{
              onChange: (e) => {
                onSelectImage(e.target.value);
              },
              value: filter.signature,
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

export default FilterAvatar;
