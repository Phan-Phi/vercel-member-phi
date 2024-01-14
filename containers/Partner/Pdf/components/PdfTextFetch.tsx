import { Text, StyleSheet } from "@react-pdf/renderer";
import { MERCHANTS, MERCHANTS_STORES_BRANCHES_ORDERS } from "apis";
import axios from "axios";
import { TableCellWithFetch } from "components";
import { useFetch } from "hooks";
import { transformUrl } from "libs";
import { useEffect, useMemo } from "react";

import useSWR from "swr";

const styles = StyleSheet.create({
  tableCell: {
    margin: "auto",
    marginTop: 5,
    marginBottom: 5,
    fontSize: 7,
    fontWeight: "bold",
  },
});

interface Props {
  url: string;
  type: string;
  transactionType: string;
}

export default function PdfTextFetch({ url, type, transactionType }: Props) {
  // console.log("🚀 ~ PdfTextFetch ~ url:", url);
  const { data: datademo } = useSWR(
    // "https://member-api.t-solution.vn/admin/merchants/stores/branches/orders/6e0d15c1-3d9f-4f99-92f9-1e5503e3e169/"
    url
  );

  // const { data: datademo2 } = useSWR(
  //   transformUrl(`${MERCHANTS_STORES_BRANCHES_ORDERS}${url}/`, {
  //     // ...omit(filter, "range"),
  //   })
  // );
  // console.log(
  //   "🚀 ~ PdfTextFetch ~ datademo:",
  //   transformUrl(
  //     `${MERCHANTS_STORES_BRANCHES_ORDERS}6e0d15c1-3d9f-4f99-92f9-1e5503e3e169/`,
  //     {
  //       // ...omit(filter, "range"),
  //     }
  //   )
  // );

  // "https://member-api.t-solution.vn/admin/merchants/stores/branches/orders/a3834fc3-1a13-48ee-8f4d-9e3b0e9b1f86/"
  // url
  // console.log("🚀 ~ PdfTextFetch ~ datademo:", datademo);
  //member-api.t-solution.vn/admin/merchants/stores/branches/orders/88792ce5-ca6e-49a4-b2bd-80eee3258379/
  // console.log("🚀 ~ PdfTextFetch ~ datademo:", datademo);

  // const { resData: datademo, changeKey } = useFetch<any>(
  //   "/admin/merchants/stores/branches/orders/6e0d15c1-3d9f-4f99-92f9-1e5503e3e169/"
  // );
  // console.log("🚀 ~ PdfTextFetch ~ datademo:", datademo);

  const render = useMemo(() => {
    return (
      <></>
      // <Text style={styles.tableCell}>
      //   {datademo
      //     ? type === "customer_name"
      //       ? datademo.customer_name
      //       : datademo.cashier_name
      //     : "..."}
      // </Text>
      // <TableCellWithFetch url={url}>
      //   {(data) => {
      //     if (data == undefined) {
      //       return <Text style={styles.tableCell}>-</Text>;
      //     }
      //     return <Text style={styles.tableCell}>{data.cashier_name}</Text>;
      //   }}
      //   {/* <Text style={styles.tableCell}>{datademo ? datademo.cashier_name : "null"}</Text> */}
      // </TableCellWithFetch>
      // <Text style={styles.tableCell}>{datademo ? datademo.cashier_name : "null"}</Text>
    );
  }, [url]);

  return render;
}
// useEffect(() => {
//   if (resData == undefined) return;
//   if (resData.next === null) return;
//   changeKey(resData.next);
//   console.log("🚀 ~ useEffect ~ filter:", filter);

//   // changeKey(
//   //   transformUrl(`${MERCHANTS}${query.merchantId}/transactions/`, {
//   //     ...omit(defaultFilterValue, "range"),
//   //     date_created_start: filter.range.startDate
//   //       ? transformDate(filter.range.startDate, "date_start")
//   //       : undefined,
//   //     date_created_end: filter.range.endDate
//   //       ? transformDate(filter.range.endDate, "date_end")
//   //       : undefined,
//   //   })
//   // );
// }, [resData]);
