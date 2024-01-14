import dynamic from "next/dynamic";
import React, { useCallback, useState } from "react";

import { Stack } from "@mui/material";

import TabOrderByStore from "./TabOrderByStore";
import { IFilterProps } from "./CustomerReport";
import { TabPanel, Tabs, Loading } from "components";

const TabOrderByRegion = dynamic(() => import("./TabOrderByRegion"), {
  loading: Loading,
});

const TabOrderByCategory = dynamic(() => import("./TabOrderByCategory"), {
  loading: Loading,
});

interface CustomerReportChartByOrderProps {
  filter: IFilterProps;
  setTabChild: (n: number) => void;
}

const TAB_PANEL_DATA = [
  { id: 0, title: "Đơn hàng theo quán" },
  { id: 1, title: "Đơn hàng theo khu vực" },
  { id: 2, title: "Đơn hàng theo danh mục" },
];

const CustomerReportChartByOrder = (props: CustomerReportChartByOrderProps) => {
  const { filter, setTabChild } = props;

  const [currentTab, setCurrentTab] = useState(0);

  const onChangeTabHandler = useCallback((e: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    setTabChild(newValue + 4);
  }, []);

  return (
    <Stack spacing={2} alignItems="center">
      <Tabs
        sx={{
          width: "100%",
        }}
        data={TAB_PANEL_DATA}
        onChange={onChangeTabHandler}
        value={currentTab}
      />

      <TabPanel
        value={currentTab}
        index={0}
        BoxProps={{
          width: "100%",
        }}
      >
        <TabOrderByStore filter={filter} />
      </TabPanel>

      <TabPanel
        value={currentTab}
        index={1}
        BoxProps={{
          width: "100%",
        }}
      >
        <TabOrderByRegion filter={filter} />
      </TabPanel>

      <TabPanel
        value={currentTab}
        index={2}
        BoxProps={{
          width: "100%",
        }}
      >
        <TabOrderByCategory filter={filter} />
      </TabPanel>
    </Stack>
  );
};

export default CustomerReportChartByOrder;
