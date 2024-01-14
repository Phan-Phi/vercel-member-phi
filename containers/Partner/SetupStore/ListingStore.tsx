import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState } from "react";

import get from "lodash/get";
import queryString from "query-string";
import { cloneDeep, set } from "lodash";
import { Box, Grid, Stack } from "@mui/material";

import Filter from "./Filter";
import StoreTable from "./StoreTable";
import { Container, WrapperTable } from "components";
import SearchField from "components/Filter/SearchField";

import { Sticky } from "hocs";
import { PATHNAME } from "routes";
import { SAFE_OFFSET } from "constant";
import { MERCHANTS_STORES } from "apis";
import { setFilterValue, transformUrl } from "libs";
import { useFetch, useGetHeightForTable } from "hooks";
import { MERCHANTS_STORES_ITEM, MERCHANTS_STORES_CATEGORIES_ITEM } from "interfaces";

export type StoreFilterType = {
  limit: number;
  with_count: boolean;
  offset: number;
  search?: string;
  is_active: string;
  is_published: string;
  category: MERCHANTS_STORES_CATEGORIES_ITEM | null;
};

const defaultFilterValue = {
  limit: 25,
  offset: 0,
  with_count: true,
  search: "",
  is_active: "",
  is_published: "",
  category: null,
};

const ListingPartner = () => {
  const router = useRouter();
  const [ref, { height }] = useGetHeightForTable();

  const [filter, setFilter] = useState(defaultFilterValue);

  const { data, isLoading, itemCount, changeKey } = useFetch<MERCHANTS_STORES_ITEM>(
    transformUrl(MERCHANTS_STORES, filter)
  );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        if (key === "category") {
          set(cloneFilter, key, value);
        }

        setFilter(cloneFilter);

        const params = cloneDeep(cloneFilter);

        set(params, "category", get(params, "category.self"));

        changeKey(transformUrl(MERCHANTS_STORES, params));
      };
    },
    [filter]
  );

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(transformUrl(MERCHANTS_STORES, defaultFilterValue));
  }, [filter]);

  const onViewHandler = useCallback((props: any) => {
    const { row } = props;

    const self = get(row, "original.self");

    const id = self
      .split("/")
      .filter((el: string) => {
        return el !== "";
      })
      .pop();

    const { url } = queryString.parseUrl(router.asPath);

    window.open(`${url}/${id}`, "_blank");
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

      window.open(`/${PATHNAME.DOI_TAC}/${PATHNAME.TAI_KHOAN}/${id}`, "_blank");
    };
  }, []);

  const pagination = useMemo(() => {
    return {
      pageSize: filter.limit,
      pageIndex: Math.round(filter.offset / filter.limit),
    };
  }, [filter]);

  return (
    <Container>
      <Grid container>
        <Grid item xs={3}>
          <Filter
            filter={filter}
            resetFilter={resetFilterHandler}
            onActiveChange={onFilterChangeHandler("is_active")}
            onPublished={onFilterChangeHandler("is_published")}
            onFindCategory={onFilterChangeHandler("category")}
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
                  <StoreTable
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
                </Box>
              </WrapperTable>
            </Stack>
          </Sticky>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ListingPartner;
