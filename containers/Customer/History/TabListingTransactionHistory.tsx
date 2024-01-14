import { useRouter } from "next/router";
import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";

import useSWR from "swr";
import { cloneDeep, get, omit } from "lodash";
import { Grid, Typography, Stack, Box } from "@mui/material";

import SearchField from "components/Filter/SearchField";
import TransactionHistoryTable from "./TransactionHistoryTable";
import { Loading, InputNumber, WrapperTable, BoxWithShadow } from "components";
import FilterTabListingTransactionHistory from "./FilterTabListingTransactionHistory";

import {
  responseSchema,
  CUSTOMERS_ITEM,
  CUSTOMERS_WALLETS_ITEM,
  CUSTOMERS_TRANSACTIONS_ITEM,
} from "interfaces";

import { Sticky } from "hocs";
import { CUSTOMERS } from "apis";
import { PATHNAME } from "routes";
import { SAFE_OFFSET } from "constant";
import { useFetch, useGetHeightForTable } from "hooks";
import { setFilterValue, transformDate, transformUrl } from "libs";
import { Range } from "react-date-range";

export type TabListingTransactionHistoryFilterType = {
  limit: number;
  offset: number;
  with_count: boolean;
  search?: string;
  transaction_type: string;
  range: Range;
};

const defaultFilterValue = {
  limit: 25,
  offset: 0,
  with_count: true,
  search: "",
  transaction_type: "",
  range: {
    startDate: undefined,
    endDate: undefined,
    key: "range",
  },
};

const TabListingTransactionHistory = () => {
  const router = useRouter();

  const [ref, { height }] = useGetHeightForTable();

  const [filter, setFilter] = useState(defaultFilterValue);
  const [currentKey, setCurrentKey] = useState("");

  const { data: customerData } = useSWR<CUSTOMERS_ITEM>(`${CUSTOMERS}${router.query.id}`);

  const { data: customerWalletData } = useSWR<responseSchema<CUSTOMERS_WALLETS_ITEM>>(
    () => {
      if (customerData) {
        const { wallet } = customerData;

        return wallet;
      }
    }
  );

  const { data, itemCount, isLoading, changeKey } = useFetch<CUSTOMERS_TRANSACTIONS_ITEM>(
    transformUrl(customerData?.transactions, omit(filter, "range"))
  );

  useEffect(() => {
    let cloneFilter = cloneDeep(filter);

    if (customerData == undefined) return;

    const dateStart = transformDate(filter.range.startDate, "date_start");
    const dateEnd = transformDate(filter.range.endDate, "date_end");

    if (currentKey === "range") return;

    changeKey(
      transformUrl(customerData.transactions, {
        ...omit(cloneFilter, "range"),
        date_created_start: filter.range.startDate ? dateStart : undefined,
        date_created_end: filter.range.endDate ? dateEnd : undefined,
      })
    );
  }, [customerData, filter, currentKey]);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        setCurrentKey(key);

        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        if (key === "range") return;

        const dateStart = transformDate(filter.range.startDate, "date_start");
        const dateEnd = transformDate(filter.range.endDate, "date_end");

        changeKey(
          transformUrl(customerData?.transactions, {
            ...omit(cloneFilter, "range"),
            date_created_start: filter.range.startDate ? dateStart : undefined,
            date_created_end: filter.range.endDate ? dateEnd : undefined,
          })
        );
      };
    },
    [filter, customerData]
  );

  const onClickFilterByTime = useCallback(() => {
    const cloneFilter = cloneDeep(filter);

    let dateStart: any = get(filter, "range.startDate");
    let dateEnd: any = get(filter, "range.endDate");

    dateStart = transformDate(dateStart, "date_start");
    dateEnd = transformDate(dateEnd, "date_end");

    changeKey(
      transformUrl(customerData?.transactions, {
        ...omit(cloneFilter, "range"),
        date_created_start: dateStart,
        date_created_end: dateEnd,
        offset: 0,
      })
    );
  }, [filter, customerData]);

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(
      transformUrl(customerData?.transactions, omit(defaultFilterValue, "range"))
    );
  }, [filter, customerData]);

  const pagination = useMemo(() => {
    return {
      pageSize: filter.limit,
      pageIndex: Math.round(filter.offset / filter.limit),
    };
  }, [filter]);

  const onViewHandler = useCallback((props: any) => {
    const { row } = props;

    const sourceType = row.original.source_type;

    if (sourceType === "cash.pointnote") {
      const pointNoteId = row.original.source
        .split("/")
        .filter((el: any) => el !== "")
        .pop();

      if (pointNoteId) {
        window.open(
          `/${PATHNAME.DOI_TAC}/${PATHNAME.XU_LY_DIEM}/${pointNoteId}`,
          "_blank"
        );
      }
    } else if (sourceType === "store_order.order") {
      const orderId = row.original.source
        .split("/")
        .filter((el: any) => el !== "")
        .pop();

      if (orderId) {
        window.open(`/${PATHNAME.LICH_SU_DON_HANG}/${orderId}`, "_blank");
      }
    }
  }, []);

  const onViewMerchantHandler = useCallback((props: any) => {
    const { row } = props;

    const self = get(row, "original.self");

    const id = self.split("/").filter((el: string) => {
      return el !== "";
    })[2];

    if (id) {
      window.open(`/${PATHNAME.KHACH_HANG}/${PATHNAME.TAI_KHOAN}/${id}`);
    }
  }, []);

  const renderCustomerInfo = useMemo(() => {
    if (customerData == undefined || customerWalletData == undefined) {
      return <Loading />;
    }

    const { first_name, last_name } = customerData;

    const fullName = `${last_name} ${first_name}`;

    const customerWallet = customerWalletData.results[0];

    let renderPoint = null;

    if (customerWallet) {
      const { point_in, point_out } = customerWallet;

      const point = point_in - point_out;

      renderPoint = (
        <InputNumber
          readOnly={true}
          NumberFormatProps={{
            value: point,
          }}
          InputProps={{
            sx: {
              WebkitTextFillColor: ({ palette }) => {
                return `${palette.primary2.main} !important`;
              },
            },
          }}
          FormLabelProps={{
            children: "Điểm Hiện Tại",
          }}
        />
      );
    }

    return (
      <Stack spacing={2}>
        <Typography color="primary2.main" variant="h2">
          {fullName}
        </Typography>

        {renderPoint}
      </Stack>
    );
  }, [customerData, customerWalletData]);

  if (customerData == undefined) return <Loading />;

  return (
    <Fragment>
      <Grid container>
        <Grid item xs={12}>
          <BoxWithShadow>{renderCustomerInfo}</BoxWithShadow>
        </Grid>

        <Grid item xs={3}>
          <FilterTabListingTransactionHistory
            filter={filter}
            resetFilter={resetFilterHandler}
            onFilterByTime={onClickFilterByTime}
            onTransactionChange={onFilterChangeHandler("transaction_type")}
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
                  <TransactionHistoryTable
                    data={data ?? []}
                    onPageChange={onFilterChangeHandler("page")}
                    onPageSizeChange={onFilterChangeHandler("pageSize")}
                    maxHeight={600 - (SAFE_OFFSET.top + SAFE_OFFSET.bottom) - 90}
                    count={itemCount}
                    isLoading={isLoading}
                    pagination={pagination}
                    onViewHandler={onViewHandler}
                    onViewMerchantHandler={onViewMerchantHandler}
                  />
                </Box>
              </WrapperTable>
            </Stack>
          </Sticky>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default TabListingTransactionHistory;
