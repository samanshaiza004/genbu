import { Controller, useForm } from "react-hook-form";
import { useStore } from "../utils/useStore";
import { Button, View, Text } from "tamagui";
import { StyleSheet } from "react-native";
import CurrencyInput from "react-native-currency-input";

type FormValues = {
  income: number;
};

function IncomeFormScreen({ navigation }: { navigation: any }) {
  const { control, handleSubmit } = useForm<FormValues>();
  const setIncome = useStore((state: any) => state.setIncome);

  const onSubmit = (data: FormValues) => {
    setIncome(data.income);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={styles.titleContainer}>
        <Text>set your total balance in all your accounts</Text>
      </View>
      <Controller
        name="income"
        control={control}
        render={({ field: { onChange, value } }) => (
          <CurrencyInput
            placeholder="balance"
            onChangeValue={onChange}
            value={value}
            prefix="$"
            delimiter=","
            separator="."
            precision={2}
            minValue={0}
            style={styles.input}
          />
        )}
      />
      <Button onPress={handleSubmit(onSubmit)} style={{ marginBottom: 520 }}>
        set income
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    fontSize: 32,
    marginBottom: 20,
  },
});

export default IncomeFormScreen;
