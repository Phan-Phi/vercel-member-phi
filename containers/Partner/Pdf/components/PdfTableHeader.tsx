import { View, Text, StyleSheet, Font } from "@react-pdf/renderer";

Font.register({
  family: "Roboto_Bold",
  src: "/fonts/Roboto Việt Hóa/Roboto-Bold.ttf",
});

const demo = {
  borderStyle: "solid",
  borderWidth: 1,
  borderLeftWidth: 0,
  borderTopWidth: 0,
};

const styles = StyleSheet.create({
  tableCol1: {
    width: "10%",
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
    marginTop: 10,
    marginBottom: 10,
    fontSize: 8,
    fontWeight: "bold",
    fontFamily: "Roboto_Bold",
  },
});

export default function PdfTableHeader() {
  return (
    <>
      <View style={styles.tableCol1}>
        <Text style={styles.tableCell}>Số Điểm</Text>
      </View>
      <View style={styles.tableCol2}>
        <Text style={styles.tableCell}>Đối Tượng</Text>
      </View>
      <View style={styles.tableCol3}>
        <Text style={styles.tableCell}>Order</Text>
      </View>
      <View style={styles.brand}>
        <Text style={styles.tableCell}>Chi Nhánh</Text>
      </View>
      <View style={styles.type}>
        <Text style={styles.tableCell}>Loại Giao Dịch</Text>
      </View>
      <View style={styles.date}>
        <Text style={styles.tableCell}>Ngày Tạo</Text>
      </View>
    </>
  );
}
