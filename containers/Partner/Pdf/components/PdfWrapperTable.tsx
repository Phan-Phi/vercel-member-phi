import { View, StyleSheet } from "@react-pdf/renderer";
import PdfTableContent from "./PdfTableContent";
import PdfTableHeader from "./PdfTableHeader";

const styles = StyleSheet.create({
  tables: {
    display: "table" as any,
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  },
});

export default function PdfWrapperTable({ dataTable, dataTableOrder }: any) {
  return (
    <View style={styles.tables}>
      <View style={styles.tableRow}>
        <PdfTableHeader />
      </View>

      <PdfTableContent dataTable={dataTable} dataTableOrder={dataTableOrder} />
    </View>
  );
}
