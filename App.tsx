import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Resolver, useForm } from "react-hook-form";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";

export type ExpenseItem = {
  id: string;
  title: string;
  amount: number;
  date: Date;
};

const Item = ({ item }: { item: ExpenseItem }) => {
  let amount = (item.amount / 100).toFixed(2) + "$";
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
};

function HomeScreen({ navigation }: { navigation: any }) {
  const expenses: ExpenseItem[] = [
    {
      id: "1",
      title: "Laptop charger",
      amount: 3300,
      date: new Date(),
    },
    {
      id: "2",
      title: "Redbull",
      amount: 460,
      date: new Date(),
    },
    {
      id: "3",
      title: "New pillow",
      amount: 659,
      date: new Date(),
    },
  ];
  return (
    <View style={styles.container}>
      <FlatList
        data={expenses}
        renderItem={({ item }) => <Item item={item} />}
        keyExtractor={(item) => item.id}
      />
      <Button
        title="Add expense"
        onPress={() => navigation.navigate("ExpenseForm")}
      />
      <StatusBar style="auto" />
    </View>
  );
}

type FormValues = {
  title: string;
  amount: number;
};

function ExpenseFormScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {};

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Expense form</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ExpenseForm" component={ExpenseFormScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginVertical: 0,

    justifyContent: "center",
    marginBottom: 32,
  },
  item: {
    backgroundColor: "#eee",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});
