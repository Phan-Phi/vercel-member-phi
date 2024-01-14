import { Fragment, useEffect, useState } from "react";
import { Box, Typography, styled } from "@mui/material";

import ExportItem from "./ExportItem";

import { EXPORT_FILE_ITEM } from "interfaces";

interface ContainerExportItemProps {
  data: EXPORT_FILE_ITEM[];
}

const ContainerExportItem = (props: ContainerExportItemProps) => {
  const { data } = props;

  const [storedData, setStoredData] = useState<EXPORT_FILE_ITEM[]>([]);

  useEffect(() => {
    const sortDate = data.sort(function compare(
      a: EXPORT_FILE_ITEM,
      b: EXPORT_FILE_ITEM
    ) {
      let dateA = new Date(a.date_created) as any;
      let dateB = new Date(b.date_created) as any;

      return dateB - dateA;
    });

    setStoredData(sortDate);
  }, [data]);

  return (
    <Fragment>
      <Container display="grid" rowGap={2} gridTemplateColumns="25% auto 25% 5%">
        <TitleSticky fontWeight={700}>Ngày tạo</TitleSticky>
        <TitleSticky fontWeight={700}>Nguồn</TitleSticky>
        <TitleSticky fontWeight={700}>Trạng thái</TitleSticky>
        <BoxSticky></BoxSticky>

        <ContainerItems>
          {storedData.map((el) => {
            return <ExportItem key={el.self} data={el} />;
          })}
        </ContainerItems>
      </Container>
    </Fragment>
  );
};

export default ContainerExportItem;

const Container = styled(Box)(() => {
  return {
    height: "35vh",
    overflowY: "scroll",

    "&::-webkit-scrollbar": {
      display: "none",
    },
  };
});

const ContainerItems = styled(Box)(() => {
  return {
    display: "contents",
  };
});

const TitleSticky = styled(Typography)(() => {
  return {
    position: "sticky",
    top: 0,
    alignSelf: "start",
    background: "white",
    paddingBottom: "0.5rem",
  };
});

const BoxSticky = styled(Box)(() => {
  return {
    position: "sticky",
    top: 0,

    alignSelf: "start",
    background: "white",

    height: "18.5px",
    paddingBottom: "0.5rem",
  };
});
