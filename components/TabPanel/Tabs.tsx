import React, { useMemo } from "react";

import { Tab, Tabs as MuiTabs, styled } from "@mui/material";

interface ExtendTabsProps<T extends Item>
  extends React.ComponentPropsWithoutRef<typeof MuiTabs> {
  data: T[];
}

type Item = {
  id: number;
  title: string;
};

const Tabs = <T extends Item>(props: ExtendTabsProps<T>) => {
  const { value, onChange, data, orientation, ...restProps } = props;

  const renderTab = useMemo(() => {
    return data.map((el) => {
      return (
        <Tab
          key={el.id}
          label={el.title}
          value={el.id}
          disableRipple
          sx={[
            {
              padding: "8px 16px",
            },
          ]}
        ></Tab>
      );
    });
  }, [data]);

  if (!data) {
    return null;
  }

  return (
    <StyledMuiTabs
      orientation={orientation}
      value={value}
      onChange={onChange}
      variant={"standard"}
      {...restProps}
    >
      {renderTab}
    </StyledMuiTabs>
  );
};

export default Tabs;

const StyledMuiTabs = styled(MuiTabs)(({ theme }) => {
  return {
    minHeight: "1rem !important",
    borderRadius: "0.8rem",
    boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
    marginX: "auto",
    "& .MuiButtonBase-root": {
      color: theme.palette.primary2.main,
      whiteSpace: "nowrap",
      flexGrow: 1,
      padding: 0,
      margin: 0,
      maxWidth: "none",
      minHeight: "2.5rem !important",
      alignItems: "center",
    },

    "& .Mui-selected": {
      borderBottom: "none",
      color: "white !important",
      backgroundColor: theme.palette.primary2.main,
      heigth: "100%",
      margin: 0,
    },
    "& button": {
      minWidth: "auto",
      margin: "0 1rem",
    },

    "& .MuiTabs-indicator": {
      display: "none",
    },
  };
});
