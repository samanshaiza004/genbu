import { Controller, useForm } from "react-hook-form";
import { useStore } from "../utils/useStore";
import { Alert, TextInput, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, View } from "tamagui";

type FormValues = {
  needs: number;
  wants: number;
  unexpected: number;
  debt: number;
  savings: number;
  charity: number;
};

export default function DistributionFormScreen({ navigation }: any) {
  const { control, handleSubmit, watch } = useForm<FormValues>();
  const distribution = useStore((state: any) => state.distribution);
  const setDistribution = useStore((state: any) => state.setDistribution);

  const onSubmit = async (data: FormValues) => {
    const total = Object.values(data).reduce((acc, curr) => acc + curr, 0);
    if (total !== 100) {
      Alert.alert("Error", "Total must be 100%");
      return;
    }

    try {
      await AsyncStorage.setItem("distribution", JSON.stringify(data));
      setDistribution(data);
      navigation.goBack();
    } catch (error) {
      console.error("failed to save distribution to AsyncStorage:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Controller
        name="needs"
        control={control}
        defaultValue={0}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder={`needs ${distribution.needs} (%)`}
            value={value ? value.toString() : ""}
            onChangeText={(text) => onChange(parseFloat(text))}
            style={styles.input}
            keyboardType="numeric"
          />
        )}
      />
      <Controller
        name="wants"
        control={control}
        defaultValue={0}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder={`wants ${distribution.wants} (%)`}
            value={value ? value.toString() : ""}
            onChangeText={(text) => onChange(Number.parseFloat(text))}
            style={styles.input}
            keyboardType="numeric"
          />
        )}
      />
      <Controller
        name="unexpected"
        control={control}
        defaultValue={0}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder={`unexpected ${distribution.unexpected} (%)`}
            value={value ? value.toString() : ""}
            onChangeText={(text) => onChange(Number.parseFloat(text))}
            style={styles.input}
            keyboardType="numeric"
          />
        )}
      />
      <Controller
        name="debt"
        control={control}
        defaultValue={0}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder={`debt ${distribution.debt} (%)`}
            value={value ? value.toString() : ""}
            onChangeText={(text) => onChange(parseFloat(text))}
            style={styles.input}
            keyboardType="numeric"
          />
        )}
      />
      <Controller
        name="savings"
        control={control}
        defaultValue={0}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder={`savings ${distribution.savings} (%)`}
            value={value ? value.toString() : ""}
            onChangeText={(text) => onChange(parseFloat(text))}
            style={styles.input}
            keyboardType="numeric"
          />
        )}
      />
      <Controller
        name="charity"
        control={control}
        defaultValue={0}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder={`charity ${distribution.charity} (%)`}
            value={value ? value.toString() : ""}
            onChangeText={(text) => onChange(parseFloat(text))}
            style={styles.input}
            keyboardType="numeric"
          />
        )}
      />
      <Button onPress={handleSubmit(onSubmit)}>Set Distribution</Button>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 135,
  },
  input: {
    fontSize: 18,
    marginBottom: 20,
    //borderBottomWidth: 1,
    width: "80%",
  },
});
