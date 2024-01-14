import dynamic from "next/dynamic";
import React, { Fragment, useCallback, useMemo, useState } from "react";

import { Container, Stack, Fade, Box } from "@mui/material";

import { Tabs, TabPanel, Loading } from "components";

import Point from "./Point";
import { useNotification, usePermission } from "hooks";

const ConfigNotification = dynamic(() => import("./ConfigNotification"), {
  loading: Loading,
});

const dataTab = [
  { id: 0, title: "Tích Điểm" },
  { id: 1, title: "Thông Báo" },
];

export default function ListingConfig() {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [animationState, setAnimationState] = useState<boolean>(true);

  const animationHandler = useCallback(() => {
    setAnimationState(false);

    const timer = setTimeout(() => {
      setAnimationState(true);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const changeTabHandler = useCallback((event: any, newValue: number): void => {
    animationHandler();
    setCurrentTab(newValue);
  }, []);
  const renderTabs = useMemo(() => {
    return <Tabs value={currentTab} onChange={changeTabHandler} data={dataTab} />;
  }, [currentTab]);

  const renderTabPanel = useMemo(() => {
    return (
      <Fragment>
        <TabPanel value={currentTab} index={0}>
          <Point />
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <ConfigNotification />
        </TabPanel>
      </Fragment>
    );
  }, [currentTab]);

  return (
    <Container>
      <Stack spacing={3}>
        {renderTabs}

        <Fade
          in={animationState}
          timeout={{
            enter: 500,
          }}
        >
          <Box>{renderTabPanel}</Box>
        </Fade>
      </Stack>
    </Container>
  );
}
