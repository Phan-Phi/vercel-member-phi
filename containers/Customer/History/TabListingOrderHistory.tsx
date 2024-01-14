import useSWR from "swr";
import get from "lodash/get";

import { useRouter } from "next/router";
import { cloneDeep, omit } from "lodash";
import { Grid, Typography, Stack, Box } from "@mui/material";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";

import OrderHistoryTable from "./OrderHistoryTable";
import PendingOrders from "./components/PendingOrders";
import FilterTabListingOrderHistory from "./FilterTabListingOrderHistory";

import {
  Spacing,
  Loading,
  SearchField,
  InputNumber,
  WrapperTable,
  BoxWithShadow,
} from "components";
import { Sticky } from "hocs";
import { CUSTOMERS } from "apis";
import { PATHNAME } from "routes";
import { SAFE_OFFSET } from "constant";
import { Range } from "react-date-range";
import { useFetch, useGetHeightForTable } from "hooks";
import { setFilterValue, transformDate, transformUrl } from "libs";

import {
  CUSTOMERS_ITEM,
  responseSchema,
  MERCHANTS_STORES_BRANCHES_ORDERS_ITEM,
} from "interfaces";

export type TabListingOrderHistoryFilterType = {
  limit: number;
  offset: number;
  with_count: boolean;
  search?: string;
  range: Range;
};

const defaultFilterValue = {
  limit: 25,
  offset: 0,
  with_count: true,
  search: "",
  range: {
    startDate: undefined,
    endDate: undefined,
    key: "range",
  },
};

const TabListingOrderHistory = () => {
  const router = useRouter();

  const [ref, { height }] = useGetHeightForTable();
  const [filter, setFilter] = useState(defaultFilterValue);
  const [currentKey, setCurrentKey] = useState("");

  const { data: customerData } = useSWR<CUSTOMERS_ITEM>(`${CUSTOMERS}${router.query.id}`);

  const { data: customerOrderData } = useSWR<
    responseSchema<MERCHANTS_STORES_BRANCHES_ORDERS_ITEM>
  >(() => {
    if (customerData) {
      const { orders } = customerData;

      return transformUrl(orders, {
        limit: 1,
        with_count: true,
      });
    }
  });

  const { data, itemCount, isLoading, changeKey } =
    useFetch<MERCHANTS_STORES_BRANCHES_ORDERS_ITEM>(
      transformUrl(customerData?.orders, omit(filter, "range"))
    );

  useEffect(() => {
    let cloneFilter = cloneDeep(filter);

    if (customerData == undefined) return;

    const dateStart = transformDate(filter.range.startDate, "date_start");
    const dateEnd = transformDate(filter.range.endDate, "date_end");

    if (currentKey === "range") return;

    changeKey(
      transformUrl(customerData.orders, {
        ...omit(cloneFilter, "range"),
        date_placed_start: filter.range.startDate ? dateStart : undefined,
        date_placed_end: filter.range.endDate ? dateEnd : undefined,
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
          transformUrl(customerData?.orders, {
            ...omit(cloneFilter, "range"),
            date_placed_start: filter.range.startDate ? dateStart : undefined,
            date_placed_end: filter.range.endDate ? dateEnd : undefined,
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
      transformUrl(customerData?.orders, {
        ...omit(cloneFilter, "range"),
        date_placed_start: dateStart,
        date_placed_end: dateEnd,
        offset: 0,
      })
    );
  }, [filter]);

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(transformUrl(customerData?.orders, omit(defaultFilterValue, "range")));
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

    window.open(`/${PATHNAME.LICH_SU_DON_HANG}/${id}`, "_blank");
  }, []);

  const onGotoHandler = useCallback((props: any) => {
    return (e: React.SyntheticEvent) => {
      e.preventDefault();

      // const { row } = props;
      // const self = get(row, "original.branch");
      // const id = self
      //   .split("/")
      //   .filter((el: string) => {
      //     return el !== "";
      //   })
      //   .pop();
      // router.push(`/${PATHNAME.LICH_SU_DON_HANG}/${id}`);
    };
  }, []);

  const renderCustomerInfo = useMemo(() => {
    if (customerData == undefined || customerOrderData == undefined) {
      return <Loading />;
    }

    const { first_name, last_name } = customerData;

    const fullName = `${last_name} ${first_name}`;

    const totalOrder = customerOrderData.count;

    let renderOrder = null;

    if (totalOrder != undefined) {
      renderOrder = (
        <InputNumber
          readOnly={true}
          NumberFormatProps={{
            value: totalOrder,
          }}
          InputProps={{
            sx: {
              WebkitTextFillColor: ({ palette }) => {
                return `${palette.primary2.main} !important`;
              },
            },
          }}
          FormLabelProps={{
            children: "Tổng Đơn Hàng",
          }}
        />
      );
    }

    return (
      <Stack spacing={2}>
        <Typography color="primary2.main" variant="h2">
          {fullName}
        </Typography>

        {renderOrder}
      </Stack>
    );
  }, [customerData, customerOrderData]);

  const renderPendingOrders = useMemo(() => {
    if (customerData == undefined) return;

    return (
      <Fragment>
        <PendingOrders dataCustomter={customerData} />
        <Spacing />
      </Fragment>
    );
  }, [customerData]);

  if (customerData == undefined) return <Loading />;

  return (
    <Fragment>
      <Grid container>
        <Grid item xs={12}>
          <BoxWithShadow>{renderCustomerInfo}</BoxWithShadow>
        </Grid>

        <Grid item xs={3}>
          {renderPendingOrders}

          <FilterTabListingOrderHistory
            filter={filter}
            resetFilter={resetFilterHandler}
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
                  <OrderHistoryTable
                    data={data ?? []}
                    onPageChange={onFilterChangeHandler("page")}
                    onPageSizeChange={onFilterChangeHandler("pageSize")}
                    maxHeight={600 - (SAFE_OFFSET.top + SAFE_OFFSET.bottom) - 90}
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
    </Fragment>
  );
};

export default TabListingOrderHistory;
