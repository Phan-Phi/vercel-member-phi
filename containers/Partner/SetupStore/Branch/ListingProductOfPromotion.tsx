import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState } from "react";

import { cloneDeep } from "lodash";
import { Box, Button, Stack } from "@mui/material";

import { Container, WrapperTable } from "components";
import ProductOfPromotionTable from "./ProductOfPromotionTable";

import { BUTTON, SAFE_OFFSET } from "constant";
import { setFilterValue, transformUrl } from "libs";
import { useFetch, useGetHeightForTable } from "hooks";
import { MERCHANTS_STORES_BRANCHES_PRODUCTS } from "apis";
import { MERCHANTS_STORES_BRANCHES_PROMOTIONS } from "apis";
import { MERCHANTS_STORES_BRANCHES_PROMOTIONS_ITEM } from "interfaces";

const defaultFilterValue = {
  limit: 25,
  offset: 0,
  with_count: true,
};

const ListingProductOfPromotion = () => {
  const router = useRouter();

  const [ref, { height }] = useGetHeightForTable();
  const [filter, setFilter] = useState(defaultFilterValue);

  const { data, isLoading, changeKey, itemCount } =
    useFetch<MERCHANTS_STORES_BRANCHES_PROMOTIONS_ITEM>(
      transformUrl(
        `${MERCHANTS_STORES_BRANCHES_PRODUCTS}?promotion=${MERCHANTS_STORES_BRANCHES_PROMOTIONS}${router.query.promotionId}/`,
        filter
      )
    );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        const params = cloneDeep(cloneFilter);

        changeKey(
          transformUrl(
            `${MERCHANTS_STORES_BRANCHES_PRODUCTS}?promotion=${MERCHANTS_STORES_BRANCHES_PROMOTIONS}${router.query.promotionId}/`,
            params
          )
        );
      };
    },
    [filter, router]
  );

  const pagination = useMemo(() => {
    return {
      pageSize: filter.limit,
      pageIndex: Math.round(filter.offset / filter.limit),
    };
  }, [filter]);

  return (
    <Container>
      <Stack spacing={3}>
        <WrapperTable>
          <Box ref={ref}>
            <ProductOfPromotionTable
              data={data ?? []}
              onPageChange={onFilterChangeHandler("page")}
              onPageSizeChange={onFilterChangeHandler("pageSize")}
              maxHeight={height - (SAFE_OFFSET.top + SAFE_OFFSET.bottom)}
              count={itemCount}
              isLoading={isLoading}
              pagination={pagination}
            />
          </Box>
        </WrapperTable>

        <Stack alignItems="center">
          <Button variant="outlined" onClick={router.back}>
            {BUTTON.BACK}
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default ListingProductOfPromotion;

// onClick={() => {
//   const pathnameList = router.asPath.split("/").filter((el) => el !== "");

//   pathnameList.pop();

//   router.push(`/${pathnameList.join("/")}`);
// }}
