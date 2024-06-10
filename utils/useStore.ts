import { create } from "zustand";
import { supabase } from "./supabase";
export const useStore = create((set) => ({
  expenses: [],
  tagsCreated: [],
  fetchExpenses: async () => {
    const { data } = await supabase.from("expenses").select("*");
    set({ expenses: data });
  },
  addTag: (tag: string) => {
    set((state: any) => ({
      tagsCreated: [...state.tagsCreated, tag],
    }));
  },
  addExpense: (title: string, amount: number, tags?: string[]) => {
    set((state: any) => ({
      expenses: [
        ...state.expenses,
        {
          id: (state.expenses.length + 1).toString(),
          title,
          amount,
          date: new Date(),
          tags: tags || [],
        },
      ],
    }));
  },
}));
