import { Controller, useForm } from "react-hook-form";
import { useStore } from "../utils/useStore";
import { Button, View, Text } from "tamagui";
import { StyleSheet } from "react-native";
import CurrencyInput from "react-native-currency-input";

type FormValues = {
  balance: number;
};

function IncomeFormScreen({ navigation }: { navigation: any }) {
  const { control, handleSubmit } = useForm<FormValues>();
  const setBalance = useStore((state: any) => state.setBalance);
  const setDistribution = useStore((state: any) => state.setDistribution);
  const onSubmit = (data: FormValues) => {
    const balance = data.balance;
    setBalance(data.balance);

    const distribution = {
      needs: balance * 0.5,
      wants: balance * 0.2,
      unexpected: balance * 0.1,
      debt: balance * 0.1,
      savings: balance * 0.05,
      charity: balance * 0.05,
    };
    setDistribution(distribution);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={styles.titleContainer}>
        <Text>set your total balance in all your accounts</Text>
      </View>
      <Controller
        name="balance"
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
        set balance
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
