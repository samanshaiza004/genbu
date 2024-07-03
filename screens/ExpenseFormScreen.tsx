import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextInput, StyleSheet } from "react-native";
import CurrencyInput from "react-native-currency-input";
import DropDownPicker, { ValueType } from "react-native-dropdown-picker";
import { useStore } from "../utils/useStore";
import { Button, View, Text } from "tamagui";
import { supabase } from "../utils/supabase";

type FormValues = {
  title: string;
  amount: number;
  category: string;
};

const categories = [
  { label: "Needs", value: "needs" },
  { label: "Wants", value: "wants" },
  { label: "Unexpected", value: "unexpected" },
  { label: "Debt", value: "debt" },
  { label: "Savings", value: "savings" },
  { label: "Charity", value: "charity" },
];

function ExpenseFormScreen({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const {
    control,
    handleSubmit,
    setValue,

    formState: { errors },
  } = useForm<FormValues>();
  const { userData } = route.params;
  const addExpense = useStore((state: any) => state.addExpense);

  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    setValue("category", selectedCategory ?? "");
  }, []);

  const onSubmit = (data: FormValues) => {
    addExpense({
      uid: userData.id,
      title: data.title,
      amount: data.amount,
      category: data.category,
    });
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={styles.titleContainer}>
        <Controller
          name="title"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Title"
              value={value}
              onChangeText={onChange}
              style={styles.input}
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
              style={styles.input}
            />
          )}
        />
        <View>
          <Controller
            name="category"
            control={control}
            render={({ field: { onChange, value } }) => (
              <DropDownPicker
                open={open}
                value={value}
                items={categories}
                setOpen={setOpen}
                maxHeight={180}
                setValue={(callback) => {
                  const newSelectedCategory = callback(selectedCategory);
                  setSelectedCategory(newSelectedCategory);
                  onChange(newSelectedCategory);
                }}
                textStyle={{ fontSize: 13 }}
                onChangeValue={onChange}
                placeholder="select or add tags"
                searchPlaceholder="search for category"
                style={styles.dropDownPicker}
              />
            )}
          />
        </View>
      </View>

      <View style={{ flex: 1, alignItems: "center", marginBottom: 40 }}>
        <Button onPress={handleSubmit(onSubmit)}>Add new expense</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 120,
  },
  input: {
    fontSize: 32,
    marginBottom: 20,
  },
  dropDownPicker: {
    width: "80%",
    marginHorizontal: "10%",
  },
});

export default ExpenseFormScreen;
