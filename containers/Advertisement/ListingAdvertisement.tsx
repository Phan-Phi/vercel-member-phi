import queryString from "query-string";
import { Range } from "react-date-range";
import { cloneDeep, get, omit, set } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  useFetch,
  usePermission,
  useConfirmation,
  useNotification,
  useGetHeightForTable,
} from "hooks";
import { Sticky } from "hocs";
import { PATHNAME } from "routes";
import { ADVERTISEMENTS } from "apis";
import { SAFE_OFFSET } from "constant";
import { useRouter } from "next/router";
import { Box, Grid, Stack } from "@mui/material";
import { endOfMonth, startOfMonth } from "date-fns";
import { ActionTableProps, MERCHANTS_ITEM } from "interfaces";
import { Container, SearchField, WrapperTable } from "components";
import { setFilterValue, transformDate, transformUrl } from "libs";

import axios from "axios.config";
import IconButton from "components/Button/IconButton";
import AdvertisementTable from "./AdvertisementTable";
import FilterAdvertisement from "./FilterAdvertisement";

export type PartnerFilterType = {
  limit: number;
  with_count: boolean;
  offset: number;
  search?: string;

  position_contain: string | null;
  app_type_contain: string | null;
  range: Range;
};

const defaultFilterValue: PartnerFilterType = {
  limit: 25,
  with_count: true,
  offset: 0,
  search: "",

  app_type_contain: null,
  position_contain: null,
  range: {
    startDate: undefined,
    endDate: undefined,
    key: "range",
  },
};

export default function ListingAdvertisement() {
  const router = useRouter();
  const [ref, { height }] = useGetHeightForTable();
  const { hasPermission } = usePermission("write_advertisement");

  const { onConfirm, onClose } = useConfirmation();

  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const [filter, setFilter] = useState(defaultFilterValue);

  const { data, isLoading, itemCount, changeKey, refreshData } = useFetch<MERCHANTS_ITEM>(
    transformUrl(ADVERTISEMENTS, filter)
  );

  const onGotoHandler = useCallback(() => {
    router.push(`${router.pathname}/${PATHNAME.TAO_MOI}`);
  }, [router]);

  const onViewHandler = useCallback((props: ActionTableProps<MERCHANTS_ITEM>) => {
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

  const onDeleteHandler = useCallback((props: ActionTableProps<MERCHANTS_ITEM>) => {
    const handler = async () => {
      try {
        const self = get(props, "row.original.self");

        await axios.delete(self);

        enqueueSnackbarWithSuccess("Xóa quảng cáo thành công");

        refreshData();
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        onClose();
      }
    };

    const title = get(props, "row.original.title");

    const message = `Hãy xác nhận bạn muốn xóa quảng cáo ${title}, đây là hành động không thể hoàn tác`;

    onConfirm(handler, {
      message,
    });
  }, []);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        // if (["date_created_start", "date_created_end"].includes(key)) return;
        if (key === "range") return;

        const params = cloneDeep(cloneFilter);

        set(params, "app_type_contain", get(params, "app_type_contain[0]"));
        set(params, "position_contain", get(params, "position_contain[0]"));

        // changeKey(transformUrl(ADVERTISEMENTS, omit(params, "range")));

        const dateStart = transformDate(filter.range.startDate, "date_start");
        const dateEnd = transformDate(filter.range.endDate, "date_end");

        changeKey(
          transformUrl(ADVERTISEMENTS, {
            ...omit(params, "range"),
            date_created_start: filter.range.startDate ? dateStart : undefined,
            date_created_end: filter.range.endDate ? dateEnd : undefined,
          })
        );
      };
    },
    [filter]
  );

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(transformUrl(ADVERTISEMENTS, omit(defaultFilterValue, "range")));
  }, [filter]);

  const onClickFilterByTime = useCallback(() => {
    const cloneFilter = cloneDeep(filter);

    // let dateStart: any = get(filter, "date_created_start");
    // let dateEnd: any = get(filter, "date_created_end");
    // dateStart = transformDate(dateStart, "date_start");
    // dateEnd = transformDate(dateEnd, "date_end");

    let dateStart: any = get(filter, "range.startDate");
    let dateEnd: any = get(filter, "range.endDate");

    dateStart = transformDate(dateStart, "date_start");
    dateEnd = transformDate(dateEnd, "date_end");

    set(cloneFilter, "app_type_contain", get(cloneFilter, "app_type_contain[0]"));
    set(cloneFilter, "position_contain", get(cloneFilter, "position_contain[0]"));
    changeKey(
      transformUrl(ADVERTISEMENTS, {
        ...omit(cloneFilter, "range"),
        date_created_start: dateStart,
        date_created_end: dateEnd,
        offset: 0,
      })
    );
  }, [filter]);

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
          <FilterAdvertisement
            filter={filter}
            onAppTypeContainChange={onFilterChangeHandler("app_type_contain")}
            onPositionContainChange={onFilterChangeHandler("position_contain")}
            resetFilter={resetFilterHandler}
            onFilterByTime={onClickFilterByTime}
            // onDateStartChange={onFilterChangeHandler("date_created_start")}
            // onDateEndChange={onFilterChangeHandler("date_created_end")}

            onDateRangeChange={onFilterChangeHandler("range")}
          />
        </Grid>

        <Grid item xs={9}>
          <Sticky>
            <Stack spacing={3}>
              <Stack
                columnGap={3}
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
              >
                <Stack flexGrow={1}>
                  <SearchField
                    onChange={onFilterChangeHandler("search")}
                    initSearch={filter.search}
                  />
                </Stack>

                {hasPermission && <IconButton onClick={onGotoHandler} />}
              </Stack>

              <WrapperTable>
                <Box ref={ref}>
                  <AdvertisementTable
                    data={data ?? []}
                    count={itemCount}
                    isLoading={isLoading}
                    pagination={pagination}
                    onPageChange={onFilterChangeHandler("page")}
                    onPageSizeChange={onFilterChangeHandler("pageSize")}
                    maxHeight={height - (SAFE_OFFSET.top + SAFE_OFFSET.bottom)}
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
}
