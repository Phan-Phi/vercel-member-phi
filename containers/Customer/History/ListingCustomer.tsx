import React, { useCallback, useMemo, useState } from "react";

import { cloneDeep, get } from "lodash";
import { Box, Stack } from "@mui/material";

import CustomerTable from "./CustomerTable";
import { Container, WrapperTable } from "components";
import SearchField from "components/Filter/SearchField";

import { Sticky } from "hocs";
import { PATHNAME } from "routes";
import { SAFE_OFFSET } from "constant";
import { CUSTOMERS_WALLETS } from "apis";
import { CUSTOMERS_WALLETS_ITEM } from "interfaces";
import { setFilterValue, transformUrl } from "libs";
import { useFetch, useGetHeightForTable } from "hooks";

const defaultFilterValue = {
  limit: 25,
  offset: 0,
  with_count: true,
  search: "",
};

const ListingTransaction = () => {
  const [ref, { height }] = useGetHeightForTable();

  const [filter, setFilter] = useState(defaultFilterValue);

  const { data, itemCount, isLoading, changeKey } = useFetch<CUSTOMERS_WALLETS_ITEM>(
    transformUrl(CUSTOMERS_WALLETS, filter)
  );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        const params = cloneDeep(cloneFilter);

        changeKey(transformUrl(CUSTOMERS_WALLETS, params));
      };
    },
    [filter]
  );

  const pagination = useMemo(() => {
    return {
      pageSize: filter.limit,
      pageIndex: Math.round(filter.offset / filter.limit),
    };
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

    window.open(`/${PATHNAME.KHACH_HANG}/${PATHNAME.LICH_SU}/${id}`, "_blank");
  }, []);

  const onGotoHandler = useCallback((props: any) => {
    return (e: React.SyntheticEvent) => {
      e.preventDefault();

      const { row } = props;

      const ownerUrl: string | undefined = get(row, "original.owner");

      if (ownerUrl) {
        const id = ownerUrl
          .split("/")
          .filter((el) => el !== "")
          .pop();
        if (id) {
          window.open(`/${PATHNAME.KHACH_HANG}/${PATHNAME.TAI_KHOAN}/${id}`, "_blank");
        }
      }
    };
  }, []);

  return (
    <Container>
      <Stack spacing={3}>
        <SearchField
          initSearch={filter.search}
          onChange={onFilterChangeHandler("search")}
        />

        <WrapperTable>
          <Box ref={ref}>
            <Sticky>
              <CustomerTable
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
    </Container>
  );
};

export default ListingTransaction;
