import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Stack, Button } from "@mui/material";
import { Fragment, useCallback, useMemo, useState } from "react";

import { PATHNAME } from "routes";
import { BUTTON } from "constant";
import { usePermission } from "hooks";
import { TabPanel, Container, Tabs, Loading } from "components";

const TabListingTransactionHistory = dynamic(
  () => import("./TabListingTransactionHistory"),
  {
    loading: () => <Loading />,
  }
);

const TabListingOrderHistory = dynamic(() => import("./TabListingOrderHistory"), {
  loading: () => <Loading />,
});

const TAB_PANEL_DATA = [
  { id: 0, title: "Lịch Sử Giao Dịch" },
  { id: 1, title: "Lịch Sử Đơn Hàng" },
];

const DetailCustomerContainer = () => {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState(0);

  const { hasPermission } = usePermission("read_order");

  const onChangeTabHandler = useCallback((e: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  }, []);

  const renderTabPanel = useMemo(() => {
    return (
      <Fragment>
        <TabPanel value={currentTab} index={0}>
          <TabListingTransactionHistory />
        </TabPanel>

        {hasPermission && (
          <TabPanel value={currentTab} index={1}>
            <TabListingOrderHistory />
          </TabPanel>
        )}
      </Fragment>
    );
  }, [currentTab, hasPermission]);

  const onGoBackHandler = useCallback(() => {
    router.push(`/${PATHNAME.KHACH_HANG}/${PATHNAME.LICH_SU}`);
  }, []);

  return (
    <Container>
      <Stack spacing={3}>
        <Tabs data={TAB_PANEL_DATA} onChange={onChangeTabHandler} value={currentTab} />

        {renderTabPanel}

        <Stack flexDirection="row" justifyContent="center">
          <Button variant="outlined" onClick={onGoBackHandler}>
            {BUTTON.BACK}
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default DetailCustomerContainer;
