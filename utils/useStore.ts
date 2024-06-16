import { create } from "zustand";
import { supabase } from "./supabase";
import { ExpenseItem } from "./ExpenseItem";

import AsyncStorage from "@react-native-async-storage/async-storage";

const BALANCE_KEY = "balance";
const DISTRIBUTION_KEY = "distribution";

export const useStore = create((set: any) => ({
  expenses: [],
  balance: 0,
  distribution: {
    needs: 0,
    wants: 0,
    unexpected: 0,
    debt: 0,
    saving: 0,
    charity: 0,
  },
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
  fetchExpenses: async (uid: string) => {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("uid", uid);
    if (error) {
      console.error(error);
      return [];
    }
    set({ expenses: data });
    return data;
  },
  setDistribution: async (distribution: {
    needs: number;
    wants: number;
    unexpected: number;
    debt: number;
    savings: number;
    charity: number;
  }) => {
    try {
      await AsyncStorage.setItem(
        DISTRIBUTION_KEY,
        JSON.stringify(distribution)
      );
      set({ distribution });
    } catch (error) {
      console.error("Failed to save distribution to AsyncStorage:", error);
    }
  },
  loadDistribution: async () => {
    try {
      const distribution = await AsyncStorage.getItem(DISTRIBUTION_KEY);
      if (distribution !== null) {
        set({ distribution: JSON.parse(distribution) });
      }
    } catch (error) {
      console.error("Failed to load distribution from AsyncStorage:", error);
    }
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
useStore.getState().loadDistribution();
