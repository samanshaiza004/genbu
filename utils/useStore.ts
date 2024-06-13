import { create } from "zustand";
import { supabase } from "./supabase";
import { ExpenseItem } from "./ExpenseItem";
export const useStore = create((set) => ({
  expenses: [],
  income: 0,
  setIncome: (income: number) => set({ income }),
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
    } catch (error) {
      console.error(error);
    }
  },
  addExpense: async ({ uid, title, amount, category }: ExpenseItem) => {
    try {
      console.log("addExpense", uid, title, amount, category);
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
