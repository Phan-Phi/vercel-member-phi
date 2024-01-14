import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";

import { Stack, Button } from "@mui/material";

import { TabPanel, Container, Tabs, BoxWithShadow, Loading } from "components";

import { BUTTON } from "constant";
import { usePermission } from "hooks";

const TabDetailBranchInfo = dynamic(() => import("./TabDetailBranchInfo"), {
  loading: () => <Loading />,
});

const TabListingMenu = dynamic(() => import("./TabListingMenu"), {
  loading: () => <Loading />,
});

const TabListingPromotion = dynamic(() => import("./TabListingPromotion"), {
  loading: () => <Loading />,
});

const TAB_PANEL_DATA = [
  { id: 0, title: "Thông Tin" },
  { id: 1, title: "Menu" },
  { id: 2, title: "Khuyến Mãi" },
];

const DetailBranchContainer = () => {
  const router = useRouter();
  const { hasPermission: readProductPermission } = usePermission("read_product");
  const { hasPermission: readPromotionPermission } = usePermission("read_promotion");

  const [currentTab, setCurrentTab] = React.useState(0);

  const onChangeTabHandler = useCallback((e: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  }, []);

  const renderTabPanel = useMemo(() => {
    return (
      <BoxWithShadow>
        <TabPanel value={currentTab} index={0}>
          <TabDetailBranchInfo />
        </TabPanel>

        {readProductPermission && (
          <TabPanel value={currentTab} index={1}>
            <TabListingMenu />
          </TabPanel>
        )}

        {readPromotionPermission && (
          <TabPanel value={currentTab} index={2}>
            <TabListingPromotion />
          </TabPanel>
        )}
      </BoxWithShadow>
    );
  }, [currentTab, readProductPermission, readPromotionPermission]);

  return (
    <Container>
      <Stack spacing={3}>
        <Tabs data={TAB_PANEL_DATA} onChange={onChangeTabHandler} value={currentTab} />

        {renderTabPanel}

        {/* <Stack flexDirection="row" justifyContent="center">
          <Button variant="outlined" onClick={router.back}>
            {BUTTON.BACK}
          </Button>
        </Stack> */}
      </Stack>
    </Container>
  );
};

export default DetailBranchContainer;
