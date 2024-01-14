import queryString from "query-string";
import { useRouter } from "next/router";
import { Range } from "react-date-range";
import { cloneDeep, get, omit, set } from "lodash";
import { useCallback, useMemo, useState } from "react";

import { Box, Grid, Stack } from "@mui/material";

import {
  useFetch,
  usePermission,
  useConfirmation,
  useNotification,
  useGetHeightForTable,
} from "hooks";
import { ADMINS } from "apis";
import { Sticky } from "hocs";
import { PATHNAME } from "routes";
import { SAFE_OFFSET } from "constant";
import { ADMINS_ITEM } from "interfaces";
import { Container, SearchField, WrapperTable } from "components";
import { setFilterValue, transformDate, transformUrl } from "libs";

import axios from "axios.config";
import AdminTable from "./AdminTable";
import FilterAdmin from "./FilterAdmin";
import IconButton from "components/Button/IconButton";

export type PartnerFilterType = {
  limit: number;
  with_count: boolean;
  offset: number;
  search?: string;
  range: Range;
  group: string | null;
};

const defaultFilterValue: PartnerFilterType = {
  limit: 25,
  with_count: true,
  offset: 0,
  search: "",
  range: {
    startDate: undefined,
    endDate: undefined,
    key: "range",
  },
  group: null,
};

export default function ListingSettingUser() {
  const router = useRouter();
  const [ref, { height }] = useGetHeightForTable();
  const { hasPermission } = usePermission("write_admin");
  const { onConfirm, onClose } = useConfirmation();

  // const [startDate, setStartDate] = useState<number>(
  //   transformDate(startOfMonth(new Date()), "date_start")
  // );

  // const [endDate, setEndDate] = useState<number>(
  //   transformDate(endOfMonth(new Date()), "date_end")
  // );

  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const [filter, setFilter] = useState(defaultFilterValue);

  const { data, isLoading, itemCount, changeKey, refreshData } = useFetch<ADMINS_ITEM>(
    transformUrl(ADMINS, filter)
  );

  // useEffect(() => {
  //   onClickFilterByTime();
  // }, []);

  const onGotoHandler = useCallback(() => {
    router.push(`${router.pathname}/${PATHNAME.TAO_MOI}`);
  }, [router]);

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

        enqueueSnackbarWithSuccess("Xóa danh mục thành công");

        refreshData();
      } catch (err) {
        enqueueSnackbarWithError(err);
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

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);
        cloneFilter = setFilterValue(cloneFilter, key, value);

        // if (key === "group") {
        //   set(cloneFilter, key, value);
        // }

        setFilter(cloneFilter);

        // if (["date_joined_start", "date_joined_end"].includes(key)) return;
        if (key === "range") return;

        const params = cloneDeep(cloneFilter);

        set(params, "group", get(params, "group.self"));

        // changeKey(transformUrl(ADMINS, omit(params, "range")));

        const dateStart = transformDate(filter.range.startDate, "date_start");
        const dateEnd = transformDate(filter.range.endDate, "date_end");

        changeKey(
          transformUrl(ADMINS, {
            ...omit(params, "range"),
            date_joined_start: filter.range.startDate ? dateStart : undefined,
            date_joined_end: filter.range.endDate ? dateEnd : undefined,
          })
        );
      };
    },
    [filter]
  );

  const resetFilterHandler = useCallback(() => {
    // setFilter(defaultFilterValue);

    // // changeKey(transformUrl(ADMINS, filter));

    // changeKey(
    //   transformUrl(ADMINS, {
    //     ...omit(defaultFilterValue, "range"),
    //     date_joined_start: startDate,
    //     date_joined_end: endDate,
    //   })
    // );

    setFilter(defaultFilterValue);

    changeKey(transformUrl(ADMINS, defaultFilterValue));
  }, [filter]);

  const onClickFilterByTime = useCallback(() => {
    const cloneFilter = cloneDeep(filter);

    // let dateStart: any = get(filter, "date_joined_start");
    // let dateEnd: any = get(filter, "date_joined_end");

    // dateStart = transformDate(dateStart, "date_start");
    // dateEnd = transformDate(dateEnd, "date_end");

    let dateStart: any = get(filter, "range.startDate");
    let dateEnd: any = get(filter, "range.endDate");

    dateStart = transformDate(dateStart, "date_start");
    dateEnd = transformDate(dateEnd, "date_end");

    set(cloneFilter, "group", get(cloneFilter, "group.self"));

    changeKey(
      transformUrl(ADMINS, {
        // ...cloneFilter,
        ...omit(cloneFilter, "range"),
        date_joined_start: dateStart,
        date_joined_end: dateEnd,
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
          <FilterAdmin
            filter={filter}
            onGroupChange={onFilterChangeHandler("group")}
            resetFilter={resetFilterHandler}
            onFilterByTime={onClickFilterByTime}
            // onDateStartChange={onFilterChangeHandler("date_joined_start")}
            // onDateEndChange={onFilterChangeHandler("date_joined_end")}
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
                  <AdminTable
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
