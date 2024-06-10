import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextInput } from "react-native";
import CurrencyInput from "react-native-currency-input";
import DropDownPicker, { ValueType } from "react-native-dropdown-picker";
import { useStore } from "../utils/useStore";
import { Button, View } from "tamagui";

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

function ExpenseFormScreen({ navigation }: { navigation: any }) {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>();
  const addExpense = useStore((state: any) => state.addExpense);

  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    setValue("category", selectedCategory);
  }, [selectedCategory, setValue]);

  const onSubmit = (data: FormValues) => {
    addExpense(data.title, data.amount, data.category);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 120,
        }}
      >
        <Controller
          name="title"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Title"
              value={value}
              onChangeText={onChange}
              style={{ fontSize: 32, marginBottom: 20 }}
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
              style={{ fontSize: 32, marginBottom: 20 }}
            />
          )}
        />
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            paddingHorizontal: 40,
          }}
        >
          <Controller
            name="category"
            control={control}
            render={({ field: { onChange, value } }) => (
              <DropDownPicker
                open={open}
                value={value}
                items={categories}
                setOpen={setOpen}
                setValue={(callback) => {
                  const newSelectedCategory = callback(selectedCategory);
                  setSelectedCategory(newSelectedCategory);
                  onChange(newSelectedCategory);
                }}
                onChangeValue={onChange}
                multiple={true}
                placeholder="Select or add tags"
                searchable={true}
                searchPlaceholder="search for category"
                style={{ width: "80%", marginHorizontal: "10%" }}
              />
            )}
          />
          {/* <Button onPress={addNewTag}>add tag</Button> */}
        </View>
      </View>

      <View style={{ flex: 1, alignItems: "center", marginBottom: 80 }}>
        <Button onPress={handleSubmit(onSubmit)}>Add new expense</Button>
      </View>
    </View>
  );
}

export default ExpenseFormScreen;
