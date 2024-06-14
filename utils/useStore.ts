import { create } from "zustand";
import { supabase } from "./supabase";
import { ExpenseItem } from "./ExpenseItem";

import AsyncStorage from "@react-native-async-storage/async-storage";

const BALANCE_KEY = "balance";

export const useStore = create((set: any) => ({
  expenses: [],
  balance: 0,
  setBalance: async (balance: number) => {
    try {
      await AsyncStorage.setItem(BALANCE_KEY, balance.toString());
      set({ balance });
    } catch (error) {
      console.error("Failed to save balance to AsyncStorage", error);
    }
  },
  loadBalance: async () => {
    try {
      const balance = await AsyncStorage.getItem(BALANCE_KEY);
      if (balance !== null) {
        set({ balance: Number(balance) });
      }
    } catch (error) {
      console.error("Failed to load balance from AsyncStorage", error);
    }
  },
  fetchExpenses: async () => {
    const { data, error } = await supabase.from("expenses").select("*");
    if (error) {
      console.error(error);
      return [];
    }
    set({ expenses: data });
    return data;
  },
  deleteExpense: async (id: string) => {
    try {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) {
        throw new Error(error.message);
      }
      set((state: any) => ({
        expenses: state.expenses.filter(
          (expense: ExpenseItem) => expense.id !== Number(id)
        ),
      }));
    } catch (error) {
      console.error(error);
    }
  },
  addExpense: async ({ uid, title, amount, category }: ExpenseItem) => {
    try {
      const { error } = await supabase.from("expenses").insert({
        uid: uid,
        title: title,
        amount: amount,
        category: category,
        created_at: new Date().toISOString(),
      });
      if (error) {
        throw error;
      }
    } catch (error) {
      console.log(error);
    }
  },
}));

useStore.getState().loadBalance();
