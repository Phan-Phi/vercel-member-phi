import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState } from "react";

import { Box, Grid, Stack } from "@mui/material";

import get from "lodash/get";
import { cloneDeep, set } from "lodash";

import { WrapperTable } from "components";
import SearchField from "components/Filter/SearchField";
import FilterTransactionHistory from "./FilterTransactionHistory";
import TabTransactionHistoryTable from "./TabTransactionHistoryTable";

import { Sticky } from "hocs";
import { PATHNAME } from "routes";
import { SAFE_OFFSET } from "constant";
import { MERCHANTS_WALLETS } from "apis";
import { setFilterValue, transformUrl } from "libs";
import { MERCHANTS_WALLETS_ITEM } from "interfaces";
import { useFetch, useGetHeightForTable } from "hooks";

export type ListingPartnerType = {
  limit: number;
  offset: number;
  with_count: boolean;
  search?: string;
  balance_lt: number | undefined;
};

const defaultFilterValue = {
  limit: 25,
  offset: 0,
  with_count: true,
  search: "",
  balance_lt: undefined,
};

const ListingPartner = () => {
  const router = useRouter();

  const [ref, { height }] = useGetHeightForTable();
  const [filter, setFilter] = useState(defaultFilterValue);

  const { data, itemCount, changeKey, isLoading } = useFetch<MERCHANTS_WALLETS_ITEM>(
    transformUrl(MERCHANTS_WALLETS, filter)
  );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        if (key === "balance_lt") {
          set(cloneFilter, key, value);
        }

        setFilter(cloneFilter);

        const params = cloneDeep(cloneFilter);

        set(params, "balance_lt", get(params, "balance_lt"));

        changeKey(transformUrl(MERCHANTS_WALLETS, params));
      };
    },
    [filter]
  );

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(transformUrl(MERCHANTS_WALLETS, defaultFilterValue));
  }, [filter]);

  const onViewHandler = useCallback((props: any) => {
    const { row } = props;

    const self = get(row, "original.owner");

    const id = self
      .split("/")
      .filter((el: string) => {
        return el !== "";
      })
      .pop();

    window.open(
      `/${PATHNAME.DOI_TAC}/${PATHNAME.LICH_SU}/${PATHNAME.LICH_SU_GIAO_DICH}/${id}`,
      "_blank"
    );
  }, []);

  const onGotoHandler = useCallback((props: any) => {
    return (e: React.SyntheticEvent) => {
      e.preventDefault();

      const { row } = props;

      const self = get(row, "self");

      const id = self
        .split("/")
        .filter((el: string) => {
          return el !== "";
        })
        .pop();

      window.open(`/${PATHNAME.DOI_TAC}/${PATHNAME.TAI_KHOAN}/${id}`);
    };
  }, []);

  const pagination = useMemo(() => {
    return {
      pageSize: filter.limit,
      pageIndex: Math.round(filter.offset / filter.limit),
    };
  }, [filter]);

  return (
    <Grid container>
      <Grid item xs={3}>
        <FilterTransactionHistory
          filter={filter}
          resetFilter={resetFilterHandler}
          onFilterHandler={onFilterChangeHandler("balance_lt")}
        />
      </Grid>
      <Grid item xs={9}>
        <Sticky>
          <Stack spacing={3}>
            <SearchField
              onChange={onFilterChangeHandler("search")}
              initSearch={filter.search}
            />

            <WrapperTable>
              <Box ref={ref}>
                <TabTransactionHistoryTable
                  data={data ?? []}
                  onPageChange={onFilterChangeHandler("page")}
                  onPageSizeChange={onFilterChangeHandler("pageSize")}
                  pagination={pagination}
                  maxHeight={height - (SAFE_OFFSET.top + SAFE_OFFSET.bottom)}
                  isLoading={isLoading}
                  count={itemCount}
                  onViewHandler={onViewHandler}
                  onGotoHandler={onGotoHandler}
                />
              </Box>
            </WrapperTable>
          </Stack>
        </Sticky>
      </Grid>
    </Grid>
  );
};

export default ListingPartner;
