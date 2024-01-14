import { Text, Font, StyleSheet, View } from "@react-pdf/renderer";

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

export default function InfoTransactionPdf({ merchantData }: any) {
  const { last_name, first_name, phone_number, email } = merchantData;

  return (
    <View style={styles.info}>
      <Text style={styles.title}>
        {last_name} {first_name}
      </Text>
      <Text style={styles.author}>Địa chỉ: 181 Cao Thắng</Text>
      <Text style={styles.author}>Email: {email}</Text>
      <Text style={styles.author}>Số điện thoại: {phone_number}</Text>
    </View>
  );
}
