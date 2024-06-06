import { create } from "zustand";

export const useStore = create((set) => ({
  expenses: [],
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
