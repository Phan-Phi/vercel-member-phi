import dynamic from "next/dynamic";
import { Range } from "react-date-range";
import { useCallback, useState, useEffect } from "react";

import { cloneDeep } from "lodash";
import { Box, Grid, Stack } from "@mui/material";
import { startOfMonth, endOfMonth } from "date-fns";

import FilterRegion from "./FilterRegion";
import { BoxWithShadow, Loading } from "components";
import BranchChartByRegion from "./BranchChartByRegion";

import { setFilterValue } from "libs";
import { ChoiceItem } from "interfaces";

const StoreChartByRegion = dynamic(() => import("./StoreChartByRegion"), {
  loading: Loading,
});

export interface IFilterProps {
  province: ChoiceItem | null;
  range: Range;
}

const initState: IFilterProps = {
  province: null,
  range: {
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
    key: "range",
  },
};

const PartnerReportByChart = () => {
  const [filter, setFilter] = useState<IFilterProps>(initState);
  const [holdFilter, setHoldFilter] = useState<IFilterProps>(initState);
  const [currentKey, setCurrentKey] = useState("");

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        setCurrentKey(key);

        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);
      };
    },
    [filter]
  );

  const onClickFilterByTime = useCallback(() => {
    setHoldFilter(filter);
  }, [filter]);

  const resetFilterHandler = useCallback(() => {
    setFilter(initState);
    setHoldFilter(initState);
  }, []);

  useEffect(() => {
    if (filter) {
      if (currentKey === "province") {
        onClickFilterByTime();
      }
    }
  }, [filter, currentKey]);

  return (
    <Grid container>
      <Grid item xs={3}>
        <BoxWithShadow>
          <FilterRegion
            filter={filter}
            resetFilter={resetFilterHandler}
            onFilterByTime={onClickFilterByTime}
            onDateRangeChange={onFilterChangeHandler("range")}
            onProvinceChange={onFilterChangeHandler("province")}
          />
        </BoxWithShadow>
      </Grid>

      <Grid item xs={9}>
        <Stack alignItems="center" columnGap={3}>
          <Box width="100%">
            <StoreChartByRegion filter={holdFilter} />
          </Box>

          <Box width="100%">
            <BranchChartByRegion filter={holdFilter} />
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default PartnerReportByChart;
