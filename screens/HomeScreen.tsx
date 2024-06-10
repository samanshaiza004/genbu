import { useIsFocused } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { View, SectionList, StyleSheet } from "react-native";
import { useStore } from "../utils/useStore";
import { ExpenseItem } from "../utils/ExpenseItem";
import { formatter } from "../utils/formatter";
import ExpenseItemCard from "../components/ExpenseItemCard";
import { Text, Button } from "tamagui";
import { StatusBar } from "expo-status-bar";
interface GroupedExpenseItem {
  totalAmount: number;
  expenses: ExpenseItem[];
}

const groupByMonth = (items: ExpenseItem[]) => {
  return items.reduce((acc, item) => {
    const month = item.date.toLocaleString("default", { month: "long" });
    const year = item.date.getFullYear();
    const key = `${month.toString().padStart(2, "0")}, ${year}`;

    if (!acc[key]) {
      acc[key] = { totalAmount: 0, expenses: [] };
    }

    acc[key].totalAmount += item.amount;
    acc[key].expenses.push(item);
    return acc;
  }, {} as Record<string, GroupedExpenseItem>);
};

const transformGroupedExpenses = (
  groupedExpenses: Record<string, GroupedExpenseItem>
) => {
  return Object.keys(groupedExpenses).map((month) => ({
    title: month,
    totalAmount: groupedExpenses[month].totalAmount,
    data: groupedExpenses[month].expenses,
  }));
};

export default function HomeScreen({ navigation }: { navigation: any }) {
  const [groupedExpenses, setGroupedExpenses] = useState<
    { title: string; data: ExpenseItem[] }[]
  >([]);

  const isFocused = useIsFocused();
  const expenses = useStore((state: any) => state.expenses);
  useEffect(() => {
    if (isFocused) {
      setGroupedExpenses(transformGroupedExpenses(groupByMonth(expenses)));
    }
  }, [isFocused]);
  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <SectionList
          sections={groupedExpenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ExpenseItemCard item={item} />}
          renderSectionHeader={({ section: { title, totalAmount } }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.headerText}>{title}</Text>
              <Text style={styles.headerText}>
                {formatter.format(totalAmount)}
              </Text>
            </View>
          )}
        />
      </View>

      <Button onPress={() => navigation.navigate("ExpenseForm")}>
        Add expense
      </Button>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginVertical: 0,
    justifyContent: "center",
    marginBottom: 32,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  item: {
    backgroundColor: "#eee",
    padding: 10,
    marginVertical: 6,
  },
  sectionHeader: {
    backgroundColor: "#f4f4f4",
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 12,
  },
  headerText: {
    fontSize: 17,
    fontWeight: "bold",
  },
  listContainer: {
    maxHeight: 600,
    minHeight: 300,
  },
});
