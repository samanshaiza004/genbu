import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TamaguiProvider, createTamagui } from "tamagui";
import "@tamagui/core/reset.css";
import config from "@tamagui/config/v3";

import { Session } from "@supabase/supabase-js";
import { supabase } from "./utils/supabase";

import ExpenseFormScreen from "./screens/ExpenseFormScreen";
import HomeScreen from "./screens/HomeScreen";
import Auth from "./components/Auth";

const tamaguiConfig = createTamagui(config);

type Conf = typeof tamaguiConfig;
declare module "@tamagui/core" {
  interface TamaguiCustomConfig extends Conf {}
}

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setSession(session);
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <TamaguiProvider config={tamaguiConfig}>
      {session && session.user ? (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="ExpenseForm" component={ExpenseFormScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      ) : (
        <Auth />
      )}
    </TamaguiProvider>
  );
}
