import { Box, Button, Divider, Stack, Typography } from "@mui/material";

import { StoreFilterType } from "./ListingStore";
import { BoxWithShadow, Radio, RadioItem, LazyAutocompleteV2 } from "components";

import { MERCHANTS_STORES_CATEGORIES } from "apis";
import { CommonFilterTableProps, MERCHANTS_STORES_CATEGORIES_ITEM } from "interfaces";

const IS_PUBLISHED_DATA = [
  { title: "Tất cả", value: "" },
  { title: "Hiển thị", value: "true" },
  { title: "Ẩn", value: "false" },
];

const IS_ACTIVE_DATA = [
  { title: "Tất cả", value: "" },
  { title: "Hoạt động", value: "true" },
  { title: "Không hoạt động", value: "false" },
];

type FilterProps = CommonFilterTableProps<StoreFilterType> & {
  onActiveChange: (value: any) => void;
  onPublished: (value: any) => void;
  onFindCategory: (value: any) => void;
};

const Filter = (props: FilterProps) => {
  const { filter, resetFilter, onActiveChange, onPublished, onFindCategory } = props;

  return (
    <BoxWithShadow>
      <Stack divider={<Divider />} spacing={2}>
        <Box>
          <Typography variant="h3" fontWeight={700} marginBottom={1}>
            Danh mục
          </Typography>

          <LazyAutocompleteV2<MERCHANTS_STORES_CATEGORIES_ITEM>
            {...{
              url: MERCHANTS_STORES_CATEGORIES,
              placeholder: "Danh mục",
              AutocompleteProps: {
                getOptionLabel: (option) => option.name,
                onChange: (_, value) => {
                  onFindCategory(value);
                },
                value: filter.category,
              },
            }}
          />
        </Box>

        <Box>
          <Typography variant="h3" fontWeight={700} marginBottom={1}>
            Hiển thị
          </Typography>

          <Radio
            RadioGroupProps={{
              value: filter.is_published,
              onChange(_, value) {
                onPublished(value);
              },
            }}
            renderItem={() => {
              return IS_PUBLISHED_DATA.map((el) => {
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
          <Typography variant="h3" fontWeight={700} marginBottom={1}>
            Trạng thái
          </Typography>

          <Radio
            RadioGroupProps={{
              value: filter.is_active,
              onChange(_, value) {
                onActiveChange(value);
              },
            }}
            renderItem={() => {
              return IS_ACTIVE_DATA.map((el) => {
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

export default Filter;
