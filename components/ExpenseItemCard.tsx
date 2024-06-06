import { View, StyleSheet } from "react-native";
import { formatter } from "../utils/formatter";
import { ExpenseItem } from "../utils/ExpenseItem";
import { Text } from "tamagui";
export default function ExpenseItemCard({ item }: { item: ExpenseItem }) {
  const amount = formatter.format(item.amount);
  return (
    <View style={styles.item}>
      <Text>{item.title}</Text>
      <Text>{amount}</Text>
      <Text>
        {item.date.toLocaleDateString("en-us", {
          weekday: "long",
          month: "short",
          day: "numeric",
        })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#eee",
    padding: 10,
    marginVertical: 6,
  },
});
