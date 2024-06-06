import React from "react";
import { NavigationContainer, useIsFocused } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ExpenseFormScreen from "./screens/ExpenseFormScreen";
import HomeScreen from "./screens/HomeScreen";
import "@tamagui/core/reset.css";
import { TamaguiProvider, View, createTamagui, Button, Text } from "tamagui";
import config from "@tamagui/config/v3";

const tamaguiConfig = createTamagui(config);

type Conf = typeof tamaguiConfig;
declare module "@tamagui/core" {
  interface TamaguiCustomConfig extends Conf {}
}

import { StyleSheet } from "react-native";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ExpenseForm" component={ExpenseFormScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </TamaguiProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginVertical: 0,
    justifyContent: "center",
    marginBottom: 32,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  item: {
    backgroundColor: "#eee",
    padding: 10,
    marginVertical: 6,
  },
  sectionHeader: {
    backgroundColor: "#f4f4f4",
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 12,
  },
  headerText: {
    fontSize: 17,
    fontWeight: "bold",
  },
  listContainer: {
    maxHeight: 600,
    minHeight: 300,
  },
});
