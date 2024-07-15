import { useIsFocused } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { View, SectionList, StyleSheet } from "react-native";
import { LAST_RESET_DATE_KEY, useStore } from "../utils/useStore";
import { ExpenseItem } from "../utils/ExpenseItem";
import { formatter } from "../utils/formatter";
import ExpenseItemCard from "../components/ExpenseItemCard";
import { Text, Button, XStack } from "tamagui";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface GroupedExpenseItem {
  totalAmount: number;
  expenses: ExpenseItem[];
}

const groupByCategory = (items: ExpenseItem[]) => {
  return items.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = { totalAmount: 0, expenses: [] };
    }

    acc[category].totalAmount += item.amount;
    acc[category].expenses.push(item);
    return acc;
  }, {} as Record<string, GroupedExpenseItem>);
};

const groupByMonth = (items: ExpenseItem[]) => {
  const sortedItems = items.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  return sortedItems.reduce((acc, item) => {
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

const checkNewMonth = async (navigation: any) => {
  const lastResetDate = await AsyncStorage.getItem(LAST_RESET_DATE_KEY);
  const now = new Date();

  if (
    !lastResetDate ||
    new Date(lastResetDate).getMonth() !== now.getMonth() ||
    new Date(lastResetDate).getFullYear() !== now.getFullYear()
  ) {
    navigation.navigate("MonthlyBalanceForm");
  }
};

export default function HomeScreen({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const [groupedExpenses, setGroupedExpenses] = useState<
    { title: string; data: ExpenseItem[] }[]
  >([]);
  const fetchExpenses = useStore((state: any) => state.fetchExpenses);
  const { userData } = route.params;

  const distribution = useStore((state: any) => state.distribution);

  const isFocused = useIsFocused();
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const balance = useStore((state: any) => state.balance);
  const totalExpenses = Array.from(expenses).reduce(
    (total: number, expense: any) => total + expense.amount,
    0
  );
  const fetchAndSetExpenses = async () => {
    const fetchedExpenses = await fetchExpenses(userData.id);
    setExpenses(fetchedExpenses);
    setGroupedExpenses(transformGroupedExpenses(groupByMonth(fetchedExpenses)));
  };
  const remainingIncome = balance - totalExpenses;
  useEffect(() => {
    if (isFocused) {
      checkNewMonth(navigation);
      fetchAndSetExpenses();
    }
  }, [isFocused, fetchExpenses]);
  return (
    <View style={styles.container}>
      <XStack space={16} style={{ marginBottom: 40 }}>
        <View>
          <Text>balance: {formatter.format(balance)}</Text>
          <Text>expenses: {formatter.format(totalExpenses)}</Text>
          <Text>remaining balance: {formatter.format(remainingIncome)}</Text>
        </View>
        <View style={styles.distributionContainer}>
          <Text>
            Needs: {formatter.format((balance * distribution.needs) / 100)}
          </Text>
          <Text>
            Wants: {formatter.format((balance * distribution.wants) / 100)}
          </Text>
          <Text>
            Unexpected:{" "}
            {formatter.format((balance * distribution.unexpected) / 100)}
          </Text>
          <Text>
            Debt: {formatter.format((balance * distribution.debt) / 100)}
          </Text>
          <Text>
            Savings: {formatter.format((balance * distribution.savings) / 100)}
          </Text>
          <Text>
            Charity: {formatter.format((balance * distribution.charity) / 100)}
          </Text>
        </View>
      </XStack>

      <View style={styles.incomeContainer}>
        <Button onPress={() => navigation.navigate("IncomeForm")}>
          set balance
        </Button>
        <Button onPress={() => navigation.navigate("DistributionForm")}>
          set distribution
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
            add expense
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
  distributionContainer: {},
});
