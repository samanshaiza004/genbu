import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Controller, Resolver, useForm } from "react-hook-form";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import CurrencyInput from "react-native-currency-input";

export type ExpenseItem = {
  id: string;
  title: string;
  amount: number;
  date: Date;
  tags?: string[];
};

export type ExpenseGroup = {
  month: string;
  year: string;
  items: ExpenseItem[];
};

const Item = ({ item }: { item: ExpenseItem }) => {
  const amount = `${(item.amount / 100).toFixed(2)}$`;
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

const ItemGroup = ({
  items,
  month,
  year,
}: {
  items: ExpenseItem[];
  month: string;
  year: string;
}) => {
  return (
    <div>
      {items.map((item) => (
        <Item key={item.id} item={item} />
      ))}
    </div>
  );
};

function HomeScreen({ navigation }: { navigation: any }) {
  const expenses: ExpenseItem[] = [
    {
      id: "1",
      title: "Laptop charger",
      amount: 3300,
      date: new Date("2024-03-01"),
      tags: ["misc"],
    },
    {
      id: "2",
      title: "Redbull",
      amount: 460,
      date: new Date(),
      tags: ["misc"],
    },
    {
      id: "3",
      title: "New pillow",
      amount: 659,
      date: new Date("2024-03-01"),
      tags: ["misc"],
    },
    {
      id: "4",
      title: "rent",
      amount: 140000,
      date: new Date("2024-03-01"),
    },
  ];
  return (
    <View style={styles.container}>
      <View>
        <Text>June 2024</Text>
        <FlatList
          data={expenses}
          renderItem={({ item }) => <Item item={item} />}
          keyExtractor={(item) => item.id}
        />
      </View>

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

function ExpenseFormScreen({ navigation }: { navigation: any }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Controller
        name="title"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="title"
            value={value}
            onChangeText={onChange}
            style={styles.formInput}
          />
        )}
      />
      <Controller
        name="amount"
        control={control}
        render={({ field: { onChange, value } }) => (
          <CurrencyInput
            placeholder="ex: 0.99$"
            prefix="$"
            delimiter=","
            separator="."
            precision={2}
            minValue={0}
            value={value}
            onChangeValue={onChange}
            style={styles.formInput}
          />
        )}
      />
      <Button onPress={handleSubmit(onSubmit)} title="add new expense" />
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
  formInput: {
    fontSize: 40,
  },
});
