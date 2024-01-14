import dynamic from "next/dynamic";
import { Grid } from "@mui/material";
import React, { useCallback, useState } from "react";

import PartnerReportByTable from "./PartnerReportByTable";
import { TabPanel, Container, Tabs, Loading } from "components";

const PartnerReportByChart = dynamic(() => import("./PartnerReportByChart"), {
  loading: Loading,
});

const TAB_PANEL_DATA = [
  { id: 0, title: "Tổng quan" },
  { id: 1, title: "Khu vực" },
];

const PartnerReport = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const onChangeTabHandler = useCallback((e: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <Container>
      <Grid container>
        <Grid item xs={12}>
          <Tabs data={TAB_PANEL_DATA} onChange={onChangeTabHandler} value={currentTab} />
        </Grid>

        <Grid item xs={12}>
          <TabPanel value={currentTab} index={0}>
            <PartnerReportByTable currentTab={currentTab} />
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <PartnerReportByChart />
          </TabPanel>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PartnerReport;
