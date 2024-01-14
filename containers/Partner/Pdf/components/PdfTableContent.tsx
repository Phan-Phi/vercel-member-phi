import { View, Text, StyleSheet, Font } from "@react-pdf/renderer";
import { formatDate, getDisplayValueFromChoiceItem } from "libs";
import { Fragment, useMemo } from "react";
import PdfTextFetch from "./PdfTextFetch";
import { useChoice, useFetch } from "hooks";
import PdfTextTransactionType from "./PdfTextTransactionType";
import { get } from "lodash";

Font.register({
  family: "Roboto",
  src: "/fonts/Roboto Việt Hóa/Roboto-Regular.ttf",
});

const demo = {
  borderStyle: "solid",
  borderWidth: 1,
  borderLeftWidth: 0,
  borderTopWidth: 0,
};

const styles = StyleSheet.create({
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },

  tableCol1: {
    width: "5%",
    ...demo,
  } as any,
  tableCol2: {
    width: "10%",
    ...demo,
  } as any,
  tableCol3: {
    width: "15%",
    ...demo,
  } as any,

  brand: {
    width: "20%",
    ...demo,
  } as any,

  type: {
    width: "20%",
    ...demo,
  } as any,

  date: {
    width: "25%",
    ...demo,
  } as any,
  tableCell: {
    margin: "auto",
    marginTop: 5,
    marginBottom: 5,
    fontSize: 7,
    fontWeight: "bold",
    fontFamily: "Roboto",
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
});

export default function PdfTableContent({ dataTable, dataTableOrder }: any) {
  const { transaction_type } = useChoice();

  const render = useMemo(() => {
    return dataTable.map((el: any, idx: number) => {
      const cashierName = dataTableOrder[idx].data.cashier_name;

      return (
        <View style={styles.tableRow} key={idx}>
          <View style={styles.tableCol1}>
            <Text style={styles.tableCell}>{idx + 1}</Text>
          </View>
          <View style={styles.tableCol1}>
            <Text style={styles.tableCell}>{el.directed_transaction_amount}</Text>
          </View>

          <View style={styles.tableCol2}>
            <Text style={styles.tableCell}>{el.target_name}</Text>
          </View>

          <View style={styles.tableCol3}>
            {cashierName ? (
              <Text style={styles.tableCell}>{cashierName}</Text>
            ) : (
              <Text style={styles.tableCell}>-</Text>
            )}
          </View>

          <View style={styles.brand}>
            <Text style={styles.tableCell}>{el.source_type}</Text>
          </View>

          <View style={styles.type}>
            <PdfTextTransactionType type={el.transaction_type} />
          </View>

          <View style={styles.date}>
            <Text style={styles.tableCell}>{formatDate(el.date_created)}</Text>
          </View>
        </View>
      );
    });
  }, [dataTable, transaction_type, dataTableOrder]);

  return <Fragment>{render}</Fragment>;

  // return (
  //   <>
  //     <View style={styles.tableCol}>
  //       <Text style={styles.tableCell}>React-PDF</Text>
  //     </View>
  //     <View style={styles.tableCol}>
  //       <Text style={styles.tableCell}>3 User </Text>
  //     </View>
  //     <View style={styles.tableCol}>
  //       <Text style={styles.tableCell}>2019-02-20 - 2020-02-19</Text>
  //     </View>
  //     <View style={styles.tableCol}>
  //       <Text style={styles.tableCell}>5€</Text>
  //     </View>
  //   </>
  // );
}
