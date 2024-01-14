import { Text, StyleSheet } from "@react-pdf/renderer";

import { TRANSACTION_TYPE } from "constant";
import { getDisplayValueFromChoiceItem } from "libs";

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
  type: string;
}

export default function PdfTextTransactionType({ type }: Props) {
  const displayValue = getDisplayValueFromChoiceItem(TRANSACTION_TYPE as any, type);

  return <Text style={styles.tableCell}>{displayValue}</Text>;
}
