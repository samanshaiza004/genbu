import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useStore } from "../utils/useStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Button } from "tamagui";
import { TextInput, StyleSheet } from "react-native";
const LAST_RESET_DATE_KEY = "lastResetDate";

type FormValues = {
  balance: number;
};
function MonthlyBalanceFormScreen({ navigation }: { navigation: any }) {
  const { control, handleSubmit } = useForm<FormValues>();
  const setBalance = useStore((state: any) => state.setBalance);
  const resetExpenses = useStore((state: any) => state.resetExpenses);

  const onSubmit = async (data: FormValues) => {
    const balance = data.balance;
    await setBalance(balance);
    await resetExpenses();
    await AsyncStorage.setItem(LAST_RESET_DATE_KEY, new Date().toISOString());
    navigation.navigate("Home");
  };
  return (
    <View style={styles.container}>
      <Controller
        name="balance"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="New Monthly Balance"
            value={value ? value.toString() : ""}
            onChangeText={(text) => onChange(parseFloat(text))}
            style={styles.input}
            keyboardType="numeric"
          />
        )}
      />
      <Button onPress={handleSubmit(onSubmit)}>Set Balance</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    fontSize: 18,
    marginBottom: 20,
    borderBottomWidth: 1,
    width: "80%",
  },
});

export default MonthlyBalanceFormScreen;
