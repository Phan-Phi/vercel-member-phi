import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState } from "react";

import get from "lodash/get";
import { cloneDeep } from "lodash";
import { Box, Stack } from "@mui/material";

import { WrapperTable } from "components";
import SearchField from "components/Filter/SearchField";
import TabOrderHistoryTable from "./TabOrderHistoryTable";

import { Sticky } from "hocs";
import { PATHNAME } from "routes";
import { SAFE_OFFSET } from "constant";
import { MERCHANTS_STORES } from "apis";
import { MERCHANTS_STORES_ITEM } from "interfaces";
import { setFilterValue, transformUrl } from "libs";
import { useFetch, useGetHeightForTable } from "hooks";

const defaultFilterValue = {
  limit: 25,
  offset: 0,
  with_count: true,
  search: "",
};

const TabOrderHistory = () => {
  const router = useRouter();

  const [ref, { height }] = useGetHeightForTable();
  const [filter, setFilter] = useState(defaultFilterValue);

  const { data, itemCount, isLoading, changeKey } = useFetch<MERCHANTS_STORES_ITEM>(
    transformUrl(MERCHANTS_STORES, filter)
  );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        const params = cloneDeep(cloneFilter);

        changeKey(transformUrl(MERCHANTS_STORES, params));
      };
    },
    [filter]
  );

  const onViewHandler = useCallback((props: any) => {
    const { row } = props;

    const self = get(row, "original.self");

    const id = self
      .split("/")
      .filter((el: string) => {
        return el !== "";
      })
      .pop();

    window.open(
      `/${PATHNAME.DOI_TAC}/${PATHNAME.LICH_SU}/${PATHNAME.LICH_SU_DON_HANG}/${id}`,
      "_blank"
    );
  }, []);

  const onGotoHandler = useCallback((props: any) => {
    return (e: React.SyntheticEvent) => {
      e.preventDefault();

      const { row } = props;

      const self = get(row, "original.self");

      const id = self
        .split("/")
        .filter((el: string) => {
          return el !== "";
        })
        .pop();

      window.open(`/${PATHNAME.DOI_TAC}/${PATHNAME.THIET_LAP_QUAN}/${id}`, "_blank");
    };
  }, []);

  const pagination = useMemo(() => {
    return {
      pageSize: filter.limit,
      pageIndex: Math.round(filter.offset / filter.limit),
    };
  }, [filter]);

  return (
    <Stack spacing={3}>
      <SearchField
        initSearch={filter.search}
        onChange={onFilterChangeHandler("search")}
      />

      <WrapperTable>
        <Box ref={ref}>
          <Sticky>
            <TabOrderHistoryTable
              data={data ?? []}
              onPageChange={onFilterChangeHandler("page")}
              onPageSizeChange={onFilterChangeHandler("pageSize")}
              maxHeight={height - (SAFE_OFFSET.top + SAFE_OFFSET.bottom)}
              count={itemCount}
              isLoading={isLoading}
              pagination={pagination}
              onGotoHandler={onGotoHandler}
              onViewHandler={onViewHandler}
            />
          </Sticky>
        </Box>
      </WrapperTable>
    </Stack>
  );
};

export default TabOrderHistory;
