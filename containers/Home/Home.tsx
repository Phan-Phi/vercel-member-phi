import { Range } from "react-date-range";
import React, { useCallback, useMemo, useState } from "react";

import { cloneDeep, get, omit } from "lodash";
import { Box, Grid, Stack } from "@mui/material";

import Filter from "./Filter";
import HomeTable from "./HomeTable";
import { Container, SearchField, WrapperTable } from "components";

import { Sticky } from "hocs";
import { AUDITLOGS } from "apis";
import { SAFE_OFFSET } from "constant";
import { AUDITLOGS_ITEM } from "interfaces";
import { useFetch, useGetHeightForTable } from "hooks";
import { setFilterValue, transformDate, transformUrl } from "libs";

export type HomeFilterType = {
  limit: number;
  with_count: boolean;
  offset: number;
  search?: string;
  action: string;
  range: Range;
};

const defaultFilterValue: HomeFilterType = {
  limit: 25,
  with_count: true,
  offset: 0,
  search: "",
  action: "",
  range: {
    startDate: undefined,
    endDate: undefined,
    key: "range",
  },
};

const Home = () => {
  const [ref, { height }] = useGetHeightForTable();

  const [filter, setFilter] = useState(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading } = useFetch<AUDITLOGS_ITEM>(
    transformUrl(AUDITLOGS, omit(filter, "range"))
  );

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
          transformUrl(AUDITLOGS, {
            ...omit(cloneFilter, "range"),
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

    changeKey(transformUrl(AUDITLOGS, omit(defaultFilterValue, "range")));
  }, [filter]);

  const onClickFilterByTime = useCallback(() => {
    let dateStart: any = get(filter, "range.startDate");
    let dateEnd: any = get(filter, "range.endDate");

    dateStart = transformDate(dateStart, "date_start");
    dateEnd = transformDate(dateEnd, "date_end");

    changeKey(
      transformUrl(AUDITLOGS, {
        ...omit(filter, "range"),
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
          <Filter
            filter={filter}
            resetFilter={resetFilterHandler}
            onFilterByTime={onClickFilterByTime}
            onDateRangeChange={onFilterChangeHandler("range")}
            onChangeActionHandler={onFilterChangeHandler("action")}
          />
        </Grid>
        <Grid item xs={9}>
          <Sticky>
            <Stack spacing={3}>
              <SearchField onChange={onFilterChangeHandler("search")} />

              <WrapperTable>
                <Box ref={ref}>
                  <HomeTable
                    data={data ?? []}
                    count={itemCount}
                    onPageChange={onFilterChangeHandler("page")}
                    onPageSizeChange={onFilterChangeHandler("pageSize")}
                    pagination={pagination}
                    maxHeight={height - (SAFE_OFFSET.top + SAFE_OFFSET.bottom)}
                    isLoading={isLoading}
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

export default Home;
