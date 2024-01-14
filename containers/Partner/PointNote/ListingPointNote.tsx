import { useRouter } from "next/router";
import { Range } from "react-date-range";
import { useCallback, useMemo, useState } from "react";
import axios from "axios.config";

import { cloneDeep, get, omit } from "lodash";
import queryString from "query-string";
import { Box, Grid, Stack } from "@mui/material";

import PointNoteTable from "./PointNoteTable";
import { Container, WrapperTable } from "components";
import SearchField from "components/Filter/SearchField";
import FilterListingPointNote from "./FilterListingPointNote";

import { Sticky } from "hocs";
import { POINTNOTES } from "apis";
import { PATHNAME } from "routes";
import { SAFE_OFFSET } from "constant";
import { POINTNOTES_ITEM } from "interfaces";
import { useFetch, useGetHeightForTable, useNotification, usePermission } from "hooks";
import { setFilterValue, transformDate, transformUrl } from "libs";
import IconButton from "components/Button/IconButton";
import RecoverPointPopup from "./components/RecoverPointPopup";

export type ListingPointNoteFilterType = {
  limit: number;
  offset: number;
  with_count: boolean;
  search?: string;
  flow_type: string;
  status: string;
  range: Range;
};

const defaultFilterValue = {
  limit: 25,
  offset: 0,
  with_count: true,
  search: "",
  flow_type: "",
  status: "",
  range: {
    startDate: undefined,
    endDate: undefined,
    key: "range",
  },
};

const ListingPointNote = () => {
  const router = useRouter();

  const [ref, { height }] = useGetHeightForTable();
  const { hasPermission } = usePermission("read_point_note");

  const [active, setACtive] = useState<boolean>(false);
  const [filter, setFilter] = useState(defaultFilterValue);
  const [dataRecoverPoint, setDataRecoverPoint] = useState(undefined);

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { data, itemCount, isLoading, changeKey, refreshData } =
    useFetch<POINTNOTES_ITEM>(transformUrl(POINTNOTES, omit(filter, "range")));

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        if (key === "range") return;

        const dateStart = transformDate(filter.range.startDate, "date_start");
        const dateEnd = transformDate(filter.range.endDate, "date_end");

        changeKey(
          transformUrl(POINTNOTES, {
            ...omit(cloneFilter, "range"),
            date_placed_start: filter.range.startDate ? dateStart : undefined,
            date_placed_end: filter.range.endDate ? dateEnd : undefined,
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
      transformUrl(POINTNOTES, {
        ...omit(cloneFilter, "range"),
        date_placed_start: dateStart,
        date_placed_end: dateEnd,
        offset: 0,
      })
    );
  }, [filter]);

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(transformUrl(POINTNOTES, omit(defaultFilterValue, "range")));
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

  const onGotoHandler = useCallback((props: any) => {
    return (e: React.SyntheticEvent) => {
      e.preventDefault();

      const { row } = props;

      // const self = get(row, "original.owner");
      let self;
      const selfOwner = get(row, "original.owner");
      const selfOwnerAsCustomer = get(row, "original.owner_as_customer");

      if (selfOwner) {
        self = selfOwner;
      } else {
        self = selfOwnerAsCustomer;
      }
      const id = self
        .split("/")
        .filter((el: string) => {
          return el !== "";
        })
        .pop();

      if (selfOwner) {
        window.open(`/${PATHNAME.DOI_TAC}/${PATHNAME.TAI_KHOAN}/${id}`, "_blank");
      } else {
        window.open(`/${PATHNAME.KHACH_HANG}/${PATHNAME.TAI_KHOAN}/${id}`, "_blank");
      }
    };
  }, []);

  const onRecoverPoints = useCallback((props: any) => {
    const { row } = props;
    setACtive(true);
    setDataRecoverPoint(row.original);
  }, []);

  const submit = useCallback(async () => {
    try {
      const dataInitial = {
        flow_type: "Point_To_Cash",
        note: get(dataRecoverPoint, "note"),
        point_amount: get(dataRecoverPoint, "point_amount"),
      };
      if (get(dataRecoverPoint, "owner")) {
        await axios.post(POINTNOTES, {
          ...dataInitial,
          owner: get(dataRecoverPoint, "owner"),
        });
      } else {
        await axios.post(POINTNOTES, {
          ...dataInitial,
          owner_as_customer: get(dataRecoverPoint, "owner_as_customer"),
        });
      }

      enqueueSnackbarWithSuccess("Thu hồi điểm thành công");
      refreshData();
      handleClose();
    } catch (err) {
      enqueueSnackbarWithError(err);
    }
  }, [dataRecoverPoint]);

  const handleClose = () => setACtive(false);

  return (
    <Container>
      <RecoverPointPopup
        active={active}
        handleClose={handleClose}
        data={dataRecoverPoint}
        submit={submit}
      />

      <Grid container>
        <Grid item xs={3}>
          <FilterListingPointNote
            filter={filter}
            resetFilter={resetFilterHandler}
            onFilterByTime={onClickFilterByTime}
            onFilterStatus={onFilterChangeHandler("status")}
            onFilterFlowType={onFilterChangeHandler("flow_type")}
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

                <IconButton
                  onClick={() => {
                    router.push(`${router.pathname}/${PATHNAME.TAO_MOI}`);
                  }}
                />
              </Stack>
              {/* <SearchField
                initSearch={filter.search}
                onChange={onFilterChangeHandler("search")}
              /> */}

              <WrapperTable>
                <Box ref={ref}>
                  <PointNoteTable
                    data={data ?? []}
                    onPageChange={onFilterChangeHandler("page")}
                    onPageSizeChange={onFilterChangeHandler("pageSize")}
                    maxHeight={height - (SAFE_OFFSET.top + SAFE_OFFSET.bottom)}
                    count={itemCount}
                    isLoading={isLoading}
                    pagination={pagination}
                    onGotoHandler={onGotoHandler}
                    onViewHandler={onViewHandler}
                    onRecoverPoints={onRecoverPoints}
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

export default ListingPointNote;
