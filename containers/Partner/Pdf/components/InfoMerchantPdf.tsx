import { Image, Font, StyleSheet, View, Text } from "@react-pdf/renderer";
import { formatDate } from "libs";

Font.register({
  family: "Roboto",
  src: "/fonts/Roboto Việt Hóa/Roboto-Regular.ttf",
});

const styles = StyleSheet.create({
  statement: { display: "flex", justifyContent: "space-between", flexDirection: "row" },
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
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

  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
});

export default function InfoMerchantPdf({ filter }: any) {
  const { range } = filter;
  const date = Date.now();

  const _endDate = range.endDate ? formatDate(range.endDate, "dd/MM/yyyy") : "...";
  const _startDate = range.startDate ? formatDate(range.startDate, "dd/MM/yyyy") : "...";

  return (
    <View style={styles.statement}>
      <View>
        <Text style={styles.title}>BẢNG SAO KÊ GIAO DỊCH ĐIỂM</Text>
        <Text style={styles.author}>
          Kỳ sao kê: Từ ngày {_startDate} đến ngày {_endDate}
        </Text>
        <Text style={styles.author}>
          Ngày lập sao kê: {formatDate(date, "dd/MM/yyyy")}
        </Text>
      </View>

      <View>
        <Image style={styles.image} src="/logo.png" />
      </View>
    </View>
  );
}
