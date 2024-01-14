import useSWR from "swr";

import { useRouter } from "next/router";
import { cloneDeep, get, omit } from "lodash";
import { useCallback, useMemo, useState } from "react";
import { Grid, Stack, Typography, Button, Box } from "@mui/material";

import SearchField from "components/Filter/SearchField";
import OrderHistoryWithDetailStoreTable from "./OrderHistoryWithDetailStoreTable";
import FilterOrderHistoryWithDetailStore from "./FilterOrderHistoryWithDetailStore";

import { Sticky } from "hocs";
import { PATHNAME } from "routes";
import { Range } from "react-date-range";
import { BUTTON, SAFE_OFFSET } from "constant";
import { useFetch, useGetHeightForTable } from "hooks";
import { setFilterValue, transformDate, transformUrl } from "libs";
import { MERCHANTS_STORES, MERCHANTS_STORES_BRANCHES_ORDERS } from "apis";
import {
  Loading,
  Container,
  BoxWithShadow,
  InputNumber,
  WrapperTable,
  Spacing,
} from "components";

import {
  responseSchema,
  MERCHANTS_STORES_ITEM,
  MERCHANTS_STORES_BRANCHES_ORDERS_ITEM,
} from "interfaces";

export type OrderHistoryWithDetailStoreFilterType = {
  limit: number;
  offset: number;
  with_count: boolean;
  search: string;
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

const OrderHistoryWithDetailStore = () => {
  const router = useRouter();
  const [ref, { height }] = useGetHeightForTable();
  const [filter, setFilter] = useState(defaultFilterValue);

  const { data: merchantStoreData } = useSWR<MERCHANTS_STORES_ITEM>(
    `${MERCHANTS_STORES}${router.query.storeId}`
  );

  const { data: merchantStoreBranchOrderData } = useSWR<
    responseSchema<MERCHANTS_STORES_BRANCHES_ORDERS_ITEM>
  >(
    transformUrl(MERCHANTS_STORES_BRANCHES_ORDERS, {
      store: `${MERCHANTS_STORES}${router.query.storeId}/`,
      with_count: true,
      limit: 1,
    })
  );

  const { data, isLoading, changeKey, itemCount } =
    useFetch<MERCHANTS_STORES_BRANCHES_ORDERS_ITEM>(
      transformUrl(
        `${MERCHANTS_STORES_BRANCHES_ORDERS}?store=${MERCHANTS_STORES}${router.query.storeId}/`,
        omit(filter, "range")
      )
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

    window.open(`/${PATHNAME.LICH_SU_DON_HANG}/${id}`, "_blank");
  }, []);

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
          transformUrl(
            `${MERCHANTS_STORES_BRANCHES_ORDERS}?store=${MERCHANTS_STORES}${router.query.storeId}/`,
            {
              ...omit(params, "range"),
              date_placed_start: filter.range.startDate ? dateStart : undefined,
              date_placed_end: filter.range.endDate ? dateEnd : undefined,
            }
          )
        );
      };
    },
    [filter, router]
  );

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(
      transformUrl(
        `${MERCHANTS_STORES_BRANCHES_ORDERS}?store=${MERCHANTS_STORES}${router.query.storeId}/`,
        omit(defaultFilterValue, "range")
      )
    );
  }, [filter, router]);

  const onClickFilterByTime = useCallback(() => {
    const cloneFilter = cloneDeep(filter);

    let dateStart: any = get(filter, "range.startDate");
    let dateEnd: any = get(filter, "range.endDate");

    dateStart = transformDate(dateStart, "date_start");
    dateEnd = transformDate(dateEnd, "date_end");

    changeKey(
      transformUrl(
        `${MERCHANTS_STORES_BRANCHES_ORDERS}?store=${MERCHANTS_STORES}${router.query.storeId}/`,
        {
          ...omit(cloneFilter, "range"),
          date_placed_start: dateStart,
          date_placed_end: dateEnd,
          offset: 0,
        }
      )
    );
  }, [filter, router]);

  const pagination = useMemo(() => {
    return {
      pageSize: filter.limit,
      pageIndex: Math.round(filter.offset / filter.limit),
    };
  }, [filter]);

  const onViewCustomerHandler = useCallback((props: any) => {
    const { row } = props;

    const customerId = get(row, "original.customer");

    const id = customerId
      .split("/")
      .filter((el: string) => {
        return el !== "";
      })
      .pop();

    window.open(`/${PATHNAME.KHACH_HANG}/${PATHNAME.TAI_KHOAN}/${id}`);
  }, []);

  const onGotoHandler = useCallback(() => {
    router.push(`/${PATHNAME.DOI_TAC}/${PATHNAME.LICH_SU}`);
  }, []);

  const renderStoreInfo = useMemo(() => {
    if (merchantStoreData == undefined || merchantStoreBranchOrderData == undefined) {
      return <Loading />;
    }

    const { name } = merchantStoreData;

    const count = merchantStoreBranchOrderData.count;

    return (
      <Stack spacing={2}>
        <Typography color="primary2.main" variant="h2">
          {name}
        </Typography>
        <InputNumber
          readOnly={true}
          NumberFormatProps={{
            value: count,
          }}
          FormLabelProps={{
            children: "Tổng Đơn Hàng",
          }}
          InputProps={{
            sx: {
              WebkitTextFillColor: ({ palette }) => {
                return `${palette.primary2.main} !important`;
              },
            },
          }}
        />
      </Stack>
    );
  }, [merchantStoreData, merchantStoreBranchOrderData]);

  return (
    <Container>
      <Grid container>
        <Grid item xs={12}>
          <BoxWithShadow>{renderStoreInfo}</BoxWithShadow>
        </Grid>

        <Grid item xs={3}>
          <FilterOrderHistoryWithDetailStore
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
                  <OrderHistoryWithDetailStoreTable
                    data={data ?? []}
                    onPageChange={onFilterChangeHandler("page")}
                    onPageSizeChange={onFilterChangeHandler("pageSize")}
                    maxHeight={height - (SAFE_OFFSET.top + SAFE_OFFSET.bottom) - 90}
                    count={itemCount}
                    isLoading={isLoading}
                    pagination={pagination}
                    onGotoHandler={onGotoHandler}
                    onViewHandler={onViewHandler}
                    onViewCustomerHandler={onViewCustomerHandler}
                  />
                </Box>
              </WrapperTable>
            </Stack>
          </Sticky>
        </Grid>

        <Grid item xs={12}>
          <Stack alignItems="center">
            <Button variant="outlined" onClick={onGotoHandler}>
              {BUTTON.BACK}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderHistoryWithDetailStore;
