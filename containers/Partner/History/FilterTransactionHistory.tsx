import { Box, Stack, Switch, Button, Divider, FormControlLabel } from "@mui/material";

import { BoxWithShadow } from "components";
import { ListingPartnerType } from "./TabTransactionHistory";

import { useSetting } from "hooks";
import { CommonFilterTableProps } from "interfaces";

type FilterProps = CommonFilterTableProps<ListingPartnerType> & {
  onFilterHandler: (value: any) => void;
};

const FilterTransactionHistory = (props: FilterProps) => {
  const { filter, onFilterHandler, resetFilter } = props;

  const { wallet_point_low_threshold } = useSetting();

  return (
    <BoxWithShadow>
      <Stack divider={<Divider />} spacing={2}>
        <Box>
          <FormControlLabel
            control={<Switch color="primary2" />}
            label="Điểm thấp"
            onChange={(_, checked) => {
              if (checked) {
                onFilterHandler(wallet_point_low_threshold);
              } else {
                onFilterHandler(undefined);
              }
            }}
            checked={filter.balance_lt ? true : false}
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

export default FilterTransactionHistory;
