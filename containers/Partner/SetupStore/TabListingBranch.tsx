import React, { useCallback, useMemo, useState } from "react";

import useSWR from "swr";
import { Box } from "@mui/material";
import queryString from "query-string";
import { cloneDeep, get } from "lodash";
import { useRouter } from "next/router";

import BranchTable from "./BranchTable";
import { Loading, WrapperTable } from "components";

import { MERCHANTS_STORES } from "apis";
import { SAFE_OFFSET } from "constant";
import { setFilterValue, transformUrl } from "libs";
import { useFetch, useGetHeightForTable } from "hooks";
import { MERCHANTS_STORES_BRANCHES_ITEM, MERCHANTS_STORES_ITEM } from "interfaces";

const defaultFilterValue = {
  limit: 25,
  offset: 0,
  with_count: true,
};

const TabListingBranch = () => {
  const router = useRouter();

  const [ref, { height }] = useGetHeightForTable();
  const [filter, setFilter] = useState(defaultFilterValue);

  const { data: storeData } = useSWR<MERCHANTS_STORES_ITEM>(
    `${MERCHANTS_STORES}${router.query.id}`
  );

  const { data, isLoading, itemCount, changeKey } =
    useFetch<MERCHANTS_STORES_BRANCHES_ITEM>(transformUrl(storeData?.branches, filter));

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        const params = cloneDeep(cloneFilter);

        changeKey(transformUrl(storeData?.branches, params));
      };
    },
    [filter, storeData]
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

  if (data == undefined) return <Loading />;

  return (
    <WrapperTable>
      <Box ref={ref}>
        <BranchTable
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
    </WrapperTable>
  );
};

export default TabListingBranch;
