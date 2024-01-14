import useSWR from "swr";
import { Stack, Typography, styled } from "@mui/material";

import {
  CUSTOMERS_ITEM,
  responseSchema,
  MERCHANTS_STORES_BRANCHES_ORDERS_ITEM,
} from "interfaces";
import { transformUrl } from "libs";
import { BoxWithShadow } from "components";
import { MERCHANTS_STORES_BRANCHES_ORDERS } from "apis";

interface Props {
  dataCustomter: CUSTOMERS_ITEM;
}

export default function PendingOrders({ dataCustomter }: Props) {
  const { self } = dataCustomter;

  const { data } = useSWR<responseSchema<MERCHANTS_STORES_BRANCHES_ORDERS_ITEM>>(
    transformUrl(`${MERCHANTS_STORES_BRANCHES_ORDERS}`, {
      with_count: true,
      limit: 1,
      status: "Draft",
      customer: self,
    })
  );

  return (
    <BoxWithShadow padding={2}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="button">Số đơn chờ:</Typography>
        <Count>{data?.count}</Count>
      </Stack>
    </BoxWithShadow>
  );
}

const Count = styled(Typography)(({ theme }) => {
  return {
    ...theme.typography.button,
    fontWeight: 700,
    fontSize: "20px",
    color: theme.palette.primary.main,
  };
});
