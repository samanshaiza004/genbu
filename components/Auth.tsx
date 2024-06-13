import { useState } from "react";
import { supabase } from "../utils/supabase";
import { Alert, StyleSheet, TextInput } from "react-native";
import { View, Input, Button, Text } from "tamagui";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function signUpWithEmail() {
    try {
      setLoading(true);
      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        throw new Error(error.message);
      }
      if (!session) {
        throw new Error("check your email for a confirmation link");
      }
    } catch (error: any) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.verticallySpaced}>
        <Input
          onChangeText={setEmail}
          value={email}
          placeholder="email@address.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          onChangeText={setPassword}
          value={password}
          placeholder="password"
          autoCapitalize="none"
          secureTextEntry
        />
      </View>

      {loading ? (
        <Text>loading...</Text>
      ) : (
        <View>
          <View style={styles.verticallySpaced}>
            <Button disabled={loading} onPress={signInWithEmail}>
              Sign in
            </Button>
          </View>
          <View style={styles.verticallySpaced}>
            <Button disabled={loading} onPress={signUpWithEmail}>
              Sign up
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
});
