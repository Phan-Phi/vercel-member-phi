import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import useSWR from "swr";
import { Box } from "@mui/material";
import queryString from "query-string";
import { cloneDeep, get } from "lodash";

import { Loading } from "components";
import PromotionTable from "./PromotionTable";

import {
  MERCHANTS_STORES_BRANCHES_ITEM,
  MERCHANTS_STORES_BRANCHES_PROMOTIONS_ITEM,
} from "interfaces";

import { SAFE_OFFSET } from "constant";
import { MERCHANTS_STORES_BRANCHES } from "apis";
import { setFilterValue, transformUrl } from "libs";
import { useFetch, useGetHeightForTable } from "hooks";

const defaultFilterValue = {
  limit: 25,
  offset: 0,
  with_count: true,
};

const TabListingPromotion = () => {
  const router = useRouter();

  const [ref, { height }] = useGetHeightForTable();
  const [filter, setFilter] = useState(defaultFilterValue);

  const { data: storeBranchData } = useSWR<MERCHANTS_STORES_BRANCHES_ITEM>(
    `${MERCHANTS_STORES_BRANCHES}${router.query.branchId}`
  );

  const promotionUrl = get(storeBranchData, "promotions");

  const { data, isLoading, changeKey, itemCount } =
    useFetch<MERCHANTS_STORES_BRANCHES_PROMOTIONS_ITEM>(
      transformUrl(promotionUrl, filter)
    );

  useEffect(() => {
    if (promotionUrl == undefined) return;

    changeKey(transformUrl(promotionUrl, filter));
  }, [promotionUrl, filter]);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        const params = cloneDeep(cloneFilter);

        changeKey(transformUrl(promotionUrl, params));
      };
    },
    [filter, promotionUrl]
  );

  const onViewHandler = useCallback((props: any) => {
    const { row } = props;

    const self = get(row, "original.self");

    const branchId = self
      .split("/")
      .filter((el: string) => {
        return el !== "";
      })
      .pop();

    const { url } = queryString.parseUrl(router.asPath);

    window.open(`${url}/${branchId}`, "_blank");
  }, []);

  const pagination = useMemo(() => {
    return {
      pageSize: filter.limit,
      pageIndex: Math.round(filter.offset / filter.limit),
    };
  }, [filter]);

  if (storeBranchData == undefined || data == undefined) return <Loading />;

  return (
    <Box ref={ref}>
      <PromotionTable
        data={data ?? []}
        onPageChange={onFilterChangeHandler("page")}
        onPageSizeChange={onFilterChangeHandler("pageSize")}
        maxHeight={height - (SAFE_OFFSET.top + SAFE_OFFSET.bottom)}
        count={itemCount}
        isLoading={isLoading}
        pagination={pagination}
        onViewHandler={onViewHandler}
      />
    </Box>
  );
};

export default TabListingPromotion;
