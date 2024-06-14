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
  return Array.from(items).reduce((acc, item) => {
    const month = new Date(item.created_at).toLocaleString("default", {
      month: "long",
    });
    const year = new Date(item.created_at).getFullYear();
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
  const fetchExpenses = useStore((state: any) => state.fetchExpenses);

  const isFocused = useIsFocused();
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const balance = useStore((state: any) => state.balance);
  const totalExpenses = Array.from(expenses).reduce(
    (total: number, expense: any) => total + expense.amount,
    0
  );
  const fetchAndSetExpenses = async () => {
    const fetchedExpenses = await fetchExpenses();
    setExpenses(fetchedExpenses);
    setGroupedExpenses(transformGroupedExpenses(groupByMonth(fetchedExpenses)));
  };
  const remainingIncome = balance - totalExpenses;
  useEffect(() => {
    if (isFocused) {
      fetchAndSetExpenses();
    }
  }, [isFocused, fetchExpenses]);
  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 40 }}>
        <Text>balance: {formatter.format(balance)}</Text>
        <Text>expenses: {formatter.format(totalExpenses)}</Text>
        <Text>remaining balance: {formatter.format(remainingIncome)}</Text>
      </View>
      <View style={styles.incomeContainer}>
        <Button onPress={() => navigation.navigate("IncomeForm")}>
          Add balance
        </Button>
      </View>
      {balance > 0 ? (
        <View>
          <View style={styles.listContainer}>
            <SectionList
              sections={groupedExpenses}
              keyExtractor={(item) => item.id as unknown as string}
              renderItem={({ item }) => (
                <ExpenseItemCard item={item} onDelete={fetchAndSetExpenses} />
              )}
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
        </View>
      ) : (
        <Text>please set your balance</Text>
      )}

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
    maxHeight: 450,
    minHeight: 300,
  },
  incomeContainer: {
    marginBottom: 40,
  },
});
