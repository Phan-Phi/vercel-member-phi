import { get } from "lodash";
import { useMemo } from "react";
import { StyleSheet, Text, View, Font } from "@react-pdf/renderer";

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

interface ItemProps {
  point: number;
  type: string;
}

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
    marginTop: 5,
    marginLeft: 5,
    marginBottom: 5,
    fontSize: 10,
    fontFamily: "Roboto_Bold",
    textAlign: "left",
  },

  tableCol1: {
    width: "33.33%",
    ...demo,
  } as any,
});

export default function PointOfUserTablePdf({ infoPoint }: any) {
  const render = useMemo(() => {
    if (infoPoint == undefined) return null;

    const topUp = infoPoint.filter((el: ItemProps) => el.type === "Top_Up");
    const withDraw = infoPoint.filter((el: ItemProps) => el.type === "Withdraw");
    const fee = infoPoint.filter((el: ItemProps) => el.type === "Fee");
    const customerUsePoint = infoPoint.filter(
      (el: ItemProps) => el.type === "Customer_Use_Point"
    );
    const giftPoint = infoPoint.filter((el: ItemProps) => el.type === "Gift_Point");

    // return <></>;
    return (
      <View style={styles.tables}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol1}>
            <Text style={styles.tableCell}>Điểm hiện tại:</Text>
          </View>

          <View style={styles.tableCol1}>
            <Text style={styles.tableCell}>
              Tổng điểm đã tích:{" "}
              {get(customerUsePoint, "[0].point") +
                get(fee, "[0].point") +
                get(topUp, "[0].point")}
            </Text>
          </View>

          <View style={styles.tableCol1}>
            <Text style={styles.tableCell}>
              Tổng điểm hiện tại:{" "}
              {get(customerUsePoint, "[0].point") + get(topUp, "[0].point")}
            </Text>
          </View>
        </View>

        <View style={styles.tableRow}>
          <View style={styles.tableCol1}>
            <Text style={styles.tableCell}>Hạn mức điểm:</Text>
          </View>

          <View style={styles.tableCol1}>
            <Text style={styles.tableCell}>
              Tích điểm/ Tặng điểm: {get(giftPoint, "[0].point")}
            </Text>
          </View>

          <View style={styles.tableCol1}>
            <Text style={styles.tableCell}>
              Khách sử dụng điểm: {get(customerUsePoint, "[0].point")}
            </Text>
          </View>
        </View>

        <View style={styles.tableRow}>
          <View style={styles.tableCol1}>
            <Text style={styles.tableCell}>Phí dịch vụ: {get(fee, "[0].point")}</Text>
          </View>

          <View style={styles.tableCol1}>
            <Text style={styles.tableCell}>Nạp điểm: {get(topUp, "[0].point")}</Text>
          </View>

          <View style={styles.tableCol1}>
            <Text style={styles.tableCell}>Rút điểm: {get(withDraw, "[0].point")}</Text>
          </View>
        </View>
      </View>
    );
  }, [infoPoint]);

  return render;
}
