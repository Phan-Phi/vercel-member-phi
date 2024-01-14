import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { Fragment, useCallback, useMemo, useState } from "react";

import { Stack, Button } from "@mui/material";

import { TabPanel, Container, Tabs, Loading } from "components";

import { PATHNAME } from "routes";
import { BUTTON } from "constant";
import { usePermission } from "hooks";

const TabDetailStoreInfo = dynamic(() => import("./TabDetailStoreInfo"), {
  loading: () => <Loading />,
});

const TabListingBranch = dynamic(() => import("./TabListingBranch"), {
  loading: () => <Loading />,
});

const TabListingRank = dynamic(() => import("./TabListingRank"), {
  loading: () => <Loading />,
});

const TabListingCustomer = dynamic(() => import("./TabListingCustomer"), {
  loading: () => <Loading />,
});

const TAB_PANEL_DATA = [
  { id: 0, title: "Thông tin quán" },
  { id: 1, title: "Chi nhánh" },
  { id: 2, title: "Hạng thành viên" },
  { id: 3, title: "Khách hàng" },
];

const DetailStoreContainer = () => {
  const router = useRouter();
  const { hasPermission } = usePermission("read_rank_band");

  const [currentTab, setCurrentTab] = useState(0);

  const onChangeTabHandler = useCallback((e: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  }, []);

  const renderTabPanel = useMemo(() => {
    return (
      <Fragment>
        <TabPanel value={currentTab} index={0}>
          <TabDetailStoreInfo />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <TabListingBranch />
        </TabPanel>

        {hasPermission && (
          <TabPanel value={currentTab} index={2}>
            <TabListingRank />
          </TabPanel>
        )}

        {hasPermission && (
          <TabPanel value={currentTab} index={3}>
            <TabListingCustomer />
          </TabPanel>
        )}
      </Fragment>
    );
  }, [currentTab, hasPermission]);

  const onBackHandler = useCallback(() => {
    router.push(`/${PATHNAME.DOI_TAC}/${PATHNAME.THIET_LAP_QUAN}`);
  }, []);

  return (
    <Container>
      <Stack spacing={3}>
        <Tabs data={TAB_PANEL_DATA} onChange={onChangeTabHandler} value={currentTab} />

        {renderTabPanel}

        <Stack flexDirection="row" justifyContent="center">
          <Button variant="outlined" onClick={onBackHandler}>
            {BUTTON.BACK}
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default DetailStoreContainer;
