import dynamic from "next/dynamic";
import { Range } from "react-date-range";
import React, { useCallback, useEffect, useState } from "react";

import { cloneDeep } from "lodash";
import { Grid } from "@mui/material";
import { startOfMonth, endOfMonth } from "date-fns";

import FilterCustomer from "./FilterCustomer";
import CustomerReportByTable from "./CustomerReportByTable";
import { TabPanel, Container, Tabs, Loading, BoxWithShadow } from "components";

import { setFilterValue } from "libs";
import { ChoiceItem, CUSTOMERS_ITEM } from "interfaces";

const CustomerReportChartByRegion = dynamic(
  () => import("./CustomerReportChartByRegion"),
  {
    loading: Loading,
  }
);

const CustomerReportChartByOrder = dynamic(() => import("./CustomerReportChartByOrder"), {
  loading: Loading,
});

const CustomerReportChartByFrequently = dynamic(
  () => import("./CustomerReportChartByFrequently"),
  {
    loading: Loading,
  }
);

const TAB_PANEL_DATA = [
  { id: 0, title: "Tổng quan" },
  { id: 1, title: "Khu vực" },
  { id: 2, title: "Hành vi khách hàng" },
  { id: 3, title: "Tần suất" },
];

export interface IFilterProps {
  province: ChoiceItem | null;
  customer: CUSTOMERS_ITEM | null;
  range: Range;
}

const initState: IFilterProps = {
  province: null,
  customer: null,
  range: {
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
    key: "range",
  },
};

const CustomerReport = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const [filter, setFilter] = useState<IFilterProps>(initState);
  const [holdFilter, setHoldFilter] = useState<IFilterProps>(initState);
  const [currentKey, setCurrentKey] = useState("");
  const [tabChild, setTabChild] = useState(4);

  const onChangeTabHandler = useCallback((e: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  }, []);

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
    const keys = ["province", "customer"];

    if (filter) {
      if (keys.includes(currentKey)) {
        onClickFilterByTime();
      }
    }
  }, [filter, currentKey]);

  return (
    <Container>
      <Grid container>
        <Grid item xs={12}>
          <Tabs data={TAB_PANEL_DATA} onChange={onChangeTabHandler} value={currentTab} />
        </Grid>

        {currentTab === 0 ? null : (
          <Grid item xs={3}>
            <BoxWithShadow>
              <FilterCustomer
                filter={filter}
                resetFilter={resetFilterHandler}
                onFilterByTime={onClickFilterByTime}
                onDateRangeChange={onFilterChangeHandler("range")}
                onProvinceChange={onFilterChangeHandler("province")}
                onCustomerChange={onFilterChangeHandler("customer")}
                isShowCustomer={currentTab === 3 ? true : false}
              />
            </BoxWithShadow>
          </Grid>
        )}

        <Grid item xs={currentTab === 0 ? 12 : 9}>
          <TabPanel value={currentTab} index={0}>
            <CustomerReportByTable />
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <CustomerReportChartByRegion filter={holdFilter} />
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            <CustomerReportChartByOrder filter={holdFilter} setTabChild={setTabChild} />
          </TabPanel>

          <TabPanel value={currentTab} index={3}>
            <CustomerReportChartByFrequently filter={holdFilter} />
          </TabPanel>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CustomerReport;
