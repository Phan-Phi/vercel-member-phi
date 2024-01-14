import { Document, Page, Font, StyleSheet, View, Text, Image } from "@react-pdf/renderer";
import React, { useEffect, useMemo, useState } from "react";
import InfoMerchantPdf from "./components/InfoMerchantPdf";
import InfoTransactionPdf from "./components/InfoTransactionPdf";
import PdfWrapperTable from "./components/PdfWrapperTable";
import { useRouter } from "next/router";
import { MERCHANTS_TRANSACTIONS_ITEM } from "interfaces";
import { useFetch } from "hooks";
import { transformDate, transformUrl } from "libs";
import { MERCHANTS } from "apis";
import PointOfUserTablePdf from "./components/PointOfUserTablePdf";

Font.register({
  family: "Roboto",
  src: "/fonts/Roboto Việt Hóa/Roboto-Regular.ttf",
});

const styles = StyleSheet.create({
  statement: { display: "flex", justifyContent: "space-between", flexDirection: "row" },
  body: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    textAlign: "left",
  },
  title: {
    fontSize: 24,
    fontFamily: "Roboto",
  },
  author: {
    fontSize: 12,
    fontFamily: "Roboto",
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
    fontFamily: "Roboto",
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "Roboto",
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  info: { textAlign: "left" },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
});

export type TransactionHistoryWithDetailPartnerFilterType = {
  limit: number;
  offset: number;
  with_count: boolean;
  search?: string;
  transaction_type: string;
};

const defaultFilterValue: TransactionHistoryWithDetailPartnerFilterType = {
  limit: 100,
  offset: 0,
  with_count: true,
  search: "",
  transaction_type: "",
};

export default function Pdf({
  merchantData,
  filter,
  dataTable,
  dataTableOrder,
  resDataWithdraw,
  // query,
  infoPoint,
}: any) {
  // const { query } = useRouter();
  // const [dataTable2, setDataTable] = useState([]);

  // const { data, resData, isLoading, itemCount, changeKey } =
  //   useFetch<MERCHANTS_TRANSACTIONS_ITEM>(
  //     transformUrl(`${MERCHANTS}${query.merchantId}/transactions/`, {
  //       // ...omit(filter, "range"),
  //       ...defaultFilterValue,
  //       date_created_start: filter.range.startDate
  //         ? transformDate(filter.range.startDate, "date_start")
  //         : undefined,
  //       date_created_end: filter.range.endDate
  //         ? transformDate(filter.range.endDate, "date_end")
  //         : undefined,
  //     })
  //   );
  // console.log("🚀 ~ ExportButtonPDF ~ resData:", data);

  // useEffect(() => {
  //   if (resData == undefined) return;
  //   changeKey(resData.next);
  // }, [resData]);

  // useEffect(() => {
  //   if (resData == undefined) return;
  //   setDataTable((el) => {
  //     return [...el, ...resData.results];
  //   });
  // }, [resData]);

  // const render = useMemo(() => {}, [resData]);

  const renderInfoMerchantPdf = useMemo(() => {
    return <InfoMerchantPdf filter={filter} />;
  }, [filter]);

  const renderPdfWrapperTable = useMemo(() => {
    if (dataTable == undefined) return;
    if (dataTableOrder == undefined) return;

    return <PdfWrapperTable dataTable={dataTable} dataTableOrder={dataTableOrder} />;
  }, [dataTable, dataTableOrder]);

  return (
    <Document>
      <Page size="A4" style={styles.body}>
        {/* <InfoMerchantPdf filter={filter} /> */}
        {/* {renderInfoMerchantPdf} */}
        {/* {merchantData && <InfoTransactionPdf merchantData={merchantData} />} */}
        {/* {infoPoint && <PointOfUserTablePdf infoPoint={infoPoint} />} */}
        {renderPdfWrapperTable}
        {/* {dataTable && <PdfWrapperTable dataTable={dataTable} />} */}
      </Page>
    </Document>
  );
}
