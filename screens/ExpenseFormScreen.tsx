import { useForm, Controller } from "react-hook-form";
import { TextInput } from "react-native";
import CurrencyInput from "react-native-currency-input";
import { useStore } from "../utils/useStore";
import { Button, View } from "tamagui";
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
  const addExpense = useStore((state: any) => state.addExpense);
  const onSubmit = (data: FormValues) => {
    addExpense(data.title, data.amount, []);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Controller
        name="title"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Title"
            value={value}
            onChangeText={onChange}
            style={{ fontSize: 32 }}
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
            style={{ fontSize: 32 }}
          />
        )}
      />
      <View>
        <Button onPress={handleSubmit(onSubmit)}>Add new expense</Button>
      </View>
    </View>
  );
}

export default ExpenseFormScreen;
