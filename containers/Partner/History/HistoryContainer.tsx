import dynamic from "next/dynamic";
import React, { Fragment, useCallback, useMemo, useState } from "react";

import { Stack } from "@mui/material";

import { TabPanel, Container, Tabs, Loading } from "components";

const TabTransactionHistory = dynamic(() => import("./TabTransactionHistory"), {
  loading: () => <Loading />,
});
const TabOrderHistory = dynamic(() => import("./TabOrderHistory"), {
  loading: () => <Loading />,
});

const TAB_PANEL_DATA = [
  { id: 0, title: "Lịch Sử Giao Dịch" },
  { id: 1, title: "Lịch Sử Đơn Hàng" },
];

const HistoryContainer = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const onChangeTabHandler = useCallback((e: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  }, []);

  const renderTabPanel = useMemo(() => {
    return (
      <Fragment>
        <TabPanel value={currentTab} index={0}>
          <TabTransactionHistory />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <TabOrderHistory />
        </TabPanel>
      </Fragment>
    );
  }, [currentTab]);

  return (
    <Container>
      <Stack spacing={3}>
        <Tabs data={TAB_PANEL_DATA} onChange={onChangeTabHandler} value={currentTab} />
        {renderTabPanel}
      </Stack>
    </Container>
  );
};

export default HistoryContainer;
