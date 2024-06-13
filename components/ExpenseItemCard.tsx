import { View, StyleSheet } from "react-native";
import { formatter } from "../utils/formatter";
import { ExpenseItem } from "../utils/ExpenseItem";
import { Text, XStack, Button } from "tamagui";
import { MoreHorizontal } from "@tamagui/lucide-icons";
export default function ExpenseItemCard({ item }: { item: ExpenseItem }) {
  const amount = formatter.format(item.amount);
  const date = new Date(item.created_at);
  return (
    <XStack flex={1} style={styles.item}>
      <View>
        <Text>{item.title}</Text>
        <Text>{amount}</Text>
      </View>
      <View style={{ marginLeft: 128 }}>
        <Text>{item.category}</Text>
        <Text>
          {date.toLocaleDateString("en-us", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </Text>
      </View>
      <View>
        <Button icon={<MoreHorizontal />}>more</Button>
      </View>
    </XStack>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#eee",
    padding: 10,
    marginVertical: 6,
  },
});
