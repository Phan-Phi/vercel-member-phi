import { useRouter } from "next/router";
import { Range } from "react-date-range";
import React, { useCallback, useMemo, useState } from "react";

import get from "lodash/get";
import axios from "axios.config";
import queryString from "query-string";
import { cloneDeep, omit } from "lodash";
import { Box, Grid, Stack } from "@mui/material";

import AccountTable from "./AccountTable";
import FilterListingAccount from "./FilterListingAccount";
import { Container, SearchField, WrapperTable } from "components";

import { Sticky } from "hocs";
import { CUSTOMERS } from "apis";
import { SAFE_OFFSET } from "constant";
import { CUSTOMERS_ITEM } from "interfaces";
import { setFilterValue, transformDate, transformUrl } from "libs";
import { useConfirmation, useNotification, useGetHeightForTable, useFetch } from "hooks";

export type ListingAccountFilterType = {
  limit: number;
  offset: number;
  with_count: boolean;
  search?: string;
  is_active: string;
  range: Range;
};

const defaultFilterValue = {
  limit: 25,
  offset: 0,
  with_count: true,
  search: "",
  is_active: "",
  range: {
    startDate: undefined,
    endDate: undefined,
    key: "range",
  },
};

const ListingAccount = () => {
  const router = useRouter();
  const { onConfirm, onClose } = useConfirmation();
  const { enqueueSnackbarWithError, enqueueSnackbarWithSuccess } = useNotification();

  const [ref, { height }] = useGetHeightForTable();
  const [filter, setFilter] = useState(defaultFilterValue);

  const { data, itemCount, isLoading, changeKey, refreshData } = useFetch<CUSTOMERS_ITEM>(
    transformUrl(CUSTOMERS, omit(filter, "range"))
  );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        if (key === "range") return;

        const params = cloneDeep(cloneFilter);

        const dateStart = transformDate(filter.range.startDate, "date_start");
        const dateEnd = transformDate(filter.range.endDate, "date_end");

        changeKey(
          transformUrl(CUSTOMERS, {
            ...omit(params, "range"),
            date_joined_start: filter.range.startDate ? dateStart : undefined,
            date_joined_end: filter.range.endDate ? dateEnd : undefined,
          })
        );
      };
    },
    [filter]
  );

  const onClickFilterByTime = useCallback(() => {
    const cloneFilter = cloneDeep(filter);

    let dateStart: any = get(filter, "range.startDate");
    let dateEnd: any = get(filter, "range.endDate");

    dateStart = transformDate(dateStart, "date_start");
    dateEnd = transformDate(dateEnd, "date_end");

    changeKey(
      transformUrl(CUSTOMERS, {
        ...omit(cloneFilter, "range"),
        date_joined_start: dateStart,
        date_joined_end: dateEnd,
        offset: 0,
      })
    );
  }, [filter]);

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(transformUrl(CUSTOMERS, omit(defaultFilterValue, "range")));
  }, [filter]);

  const pagination = useMemo(() => {
    return {
      pageSize: filter.limit,
      pageIndex: Math.round(filter.offset / filter.limit),
    };
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

  const onDeleteHandler = useCallback((props: any) => {
    const handler = async () => {
      try {
        const self = get(props, "row.original.self");

        await axios.delete(self);

        enqueueSnackbarWithSuccess("Xóa tài khoản thành công");

        refreshData();
      } catch (err) {
        const message = get(err, "response.data.message");

        enqueueSnackbarWithError(message);
      } finally {
        onClose();
      }
    };

    const firstName = get(props, "row.original.first_name");

    const message = `Hãy xác nhận bạn muốn xóa tài khoản ${firstName}, đây là hành động không thể hoàn tác`;

    onConfirm(handler, {
      message,
    });
  }, []);

  return (
    <Container>
      <Grid container>
        <Grid item xs={3}>
          <FilterListingAccount
            filter={filter}
            resetFilter={resetFilterHandler}
            onActiveChange={onFilterChangeHandler("is_active")}
            onFilterByTime={onClickFilterByTime}
            onDateRangeChange={onFilterChangeHandler("range")}
          />
        </Grid>
        <Grid item xs={9}>
          <Sticky>
            <Stack spacing={3}>
              <SearchField
                initSearch={filter.search}
                onChange={onFilterChangeHandler("search")}
              />

              <WrapperTable>
                <Box ref={ref}>
                  <AccountTable
                    data={data ?? []}
                    onPageChange={onFilterChangeHandler("page")}
                    onPageSizeChange={onFilterChangeHandler("pageSize")}
                    maxHeight={height - (SAFE_OFFSET.top + SAFE_OFFSET.bottom)}
                    count={itemCount}
                    isLoading={isLoading}
                    pagination={pagination}
                    onViewHandler={onViewHandler}
                    onDeleteHandler={onDeleteHandler}
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

export default ListingAccount;
