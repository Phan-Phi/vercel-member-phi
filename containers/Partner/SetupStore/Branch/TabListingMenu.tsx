import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import useSWR from "swr";
import { Box } from "@mui/material";
import { cloneDeep, get } from "lodash";

import { Loading } from "components";
import MenuTable from "./MenuTable";

import { SAFE_OFFSET } from "constant";
import { MERCHANTS_STORES_BRANCHES } from "apis";
import { setFilterValue, transformUrl } from "libs";
import { useFetch, useGetHeightForTable } from "hooks";
import {
  MERCHANTS_STORES_BRANCHES_ITEM,
  MERCHANTS_STORES_BRANCHES_PRODUCTS_ITEM,
} from "interfaces";

const defaultFilterValue = {
  limit: 25,
  offset: 0,
  with_count: true,
};

const TabListMenu = () => {
  const router = useRouter();

  const [ref, { height }] = useGetHeightForTable();
  const [filter, setFilter] = useState(defaultFilterValue);

  const { data: storeData } = useSWR<MERCHANTS_STORES_BRANCHES_ITEM>(
    `${MERCHANTS_STORES_BRANCHES}${router.query.branchId}`
  );

  const productUrl = get(storeData, "products");

  const { data, isLoading, itemCount, changeKey } =
    useFetch<MERCHANTS_STORES_BRANCHES_PRODUCTS_ITEM>(transformUrl(productUrl, filter));

  useEffect(() => {
    if (productUrl == undefined) return;

    changeKey(transformUrl(productUrl, filter));
  }, [productUrl, filter]);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        const params = cloneDeep(cloneFilter);

        changeKey(transformUrl(productUrl, params));
      };
    },
    [filter, productUrl]
  );

  const pagination = useMemo(() => {
    return {
      pageSize: filter.limit,
      pageIndex: Math.round(filter.offset / filter.limit),
    };
  }, [filter]);

  if (storeData == undefined || data == undefined) return <Loading />;

  return (
    <Box ref={ref}>
      <MenuTable
        data={data ?? []}
        onPageChange={onFilterChangeHandler("page")}
        onPageSizeChange={onFilterChangeHandler("pageSize")}
        maxHeight={height - (SAFE_OFFSET.top + SAFE_OFFSET.bottom)}
        count={itemCount}
        isLoading={isLoading}
        pagination={pagination}
      />
    </Box>
  );
};

export default TabListMenu;
